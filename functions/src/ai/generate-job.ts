import * as functions from "firebase-functions";
import { getAnthropicClient } from "./client";
import { FAST_MODEL, MAX_TOKENS_GENERATE } from "./constants";
import { SYSTEM_PROMPT_GENERATE, buildGenerateUserPrompt } from "./prompts";
import { checkRateLimit } from "./rate-limiter";

interface GenerateInput {
  title: string;
  department: string;
  level: string;
  location: string;
  keyRequirements: string[];
  orgId: string;
}

function validateInput(data: unknown): GenerateInput {
  const d = data as Record<string, unknown>;

  if (!d.title || typeof d.title !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "title is required");
  }
  if (!d.department || typeof d.department !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "department is required");
  }
  if (!d.level || typeof d.level !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "level is required");
  }
  if (!d.location || typeof d.location !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "location is required");
  }
  if (!Array.isArray(d.keyRequirements) || d.keyRequirements.length < 3) {
    throw new functions.https.HttpsError("invalid-argument", "keyRequirements needs at least 3 items");
  }
  if (!d.orgId || typeof d.orgId !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "orgId is required");
  }

  return {
    title: String(d.title).trim(),
    department: String(d.department).trim(),
    level: String(d.level).trim(),
    location: String(d.location).trim(),
    keyRequirements: (d.keyRequirements as unknown[]).map((r) => String(r).trim()),
    orgId: String(d.orgId).trim(),
  };
}

function parseResponse(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No parseable JSON in response");
    return JSON.parse(match[0]);
  }
}

export const generateJob = functions
  .runWith({ timeoutSeconds: 60, memory: "256MB" })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Authentication required");
    }

    const input = validateInput(data);

    try {
      await checkRateLimit(input.orgId);
    } catch (err) {
      throw new functions.https.HttpsError("resource-exhausted", (err as Error).message);
    }

    const client = getAnthropicClient();
    const userPrompt = buildGenerateUserPrompt(
      input.title, input.department, input.level, input.location, input.keyRequirements,
    );

    try {
      const message = await client.messages.create({
        model: FAST_MODEL,
        max_tokens: MAX_TOKENS_GENERATE,
        system: SYSTEM_PROMPT_GENERATE,
        messages: [{ role: "user", content: userPrompt }],
      });

      const content = message.content[0];
      if (content.type !== "text") throw new Error("Unexpected response type");

      const parsed = parseResponse(content.text);
      const salary = parsed.salaryRange as Record<string, unknown> | undefined;

      return {
        title: String(parsed.title ?? ""),
        hook: String(parsed.hook ?? ""),
        description: String(parsed.description ?? ""),
        requirements: Array.isArray(parsed.requirements) ? parsed.requirements.map(String) : [],
        benefits: Array.isArray(parsed.benefits) ? parsed.benefits.map(String) : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills.map(String) : [],
        salaryRange: {
          min: Number(salary?.min ?? 0),
          max: Number(salary?.max ?? 0),
          currency: String(salary?.currency ?? "USD"),
        },
      };
    } catch (err) {
      functions.logger.error("generateJob failed", { error: err, orgId: input.orgId });
      throw new functions.https.HttpsError("internal", "AI generation failed. Please try again.");
    }
  });
