import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { getAnthropicClient } from "./client";
import { FAST_MODEL, MAX_TOKENS_SCORE } from "./constants";
import { SYSTEM_PROMPT_SCORE } from "./prompts";
import { checkRateLimit } from "./rate-limiter";

interface ScoreInput {
  job: Record<string, unknown>;
  orgId: string;
}

// In-memory cache (5 min TTL)
const cache = new Map<string, { result: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCacheKey(job: Record<string, unknown>): string {
  return JSON.stringify({
    title: job.title, description: job.description, hook: job.hook,
    requirements: job.requirements, benefits: job.benefits, skills: job.skills,
    salaryMin: job.salaryMin, salaryMax: job.salaryMax,
  });
}

export const scoreJob = onCall(
  { timeoutSeconds: 30, memory: "256MiB" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required");
    }

    const { job, orgId } = request.data as ScoreInput;
    if (!orgId) throw new HttpsError("invalid-argument", "orgId is required");
    if (!job) throw new HttpsError("invalid-argument", "job data is required");

    // Check cache
    const key = getCacheKey(job);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.result;
    }

    try {
      await checkRateLimit(orgId);
    } catch (err) {
      throw new HttpsError("resource-exhausted", (err as Error).message);
    }

    const client = getAnthropicClient();
    const jobText = [
      `Title: ${job.title ?? ""}`,
      `Hook: ${job.hook ?? ""}`,
      `Description: ${job.description ?? ""}`,
      `Requirements: ${Array.isArray(job.requirements) ? (job.requirements as string[]).join(", ") : ""}`,
      `Benefits: ${Array.isArray(job.benefits) ? (job.benefits as string[]).join(", ") : ""}`,
      `Salary: ${job.salaryMin != null ? `$${job.salaryMin} - $${job.salaryMax}` : "Not specified"}`,
    ].join("\n");

    let attractiveness = 50;
    let inclusivity = 50;
    let suggestions: unknown[] = [];

    try {
      const message = await client.messages.create({
        model: FAST_MODEL,
        max_tokens: MAX_TOKENS_SCORE,
        system: SYSTEM_PROMPT_SCORE,
        messages: [{ role: "user", content: `Analyze this job listing:\n${jobText}` }],
      });

      const content = message.content[0];
      if (content.type === "text") {
        const parsed = JSON.parse(content.text);
        attractiveness = Math.max(0, Math.min(100, Number(parsed.attractiveness ?? 50)));
        inclusivity = Math.max(0, Math.min(100, Number(parsed.inclusivity ?? 50)));
        suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 5) : [];
      }
    } catch (err) {
      logger.error("scoreJob Claude call failed", { error: err });
      // Graceful degradation — return neutral AI dims
    }

    const result = { attractiveness, inclusivity, suggestions };
    cache.set(key, { result, timestamp: Date.now() });
    return result;
  },
);
