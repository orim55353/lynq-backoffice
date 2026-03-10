import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { getAnthropicClient } from "./client";
import { FAST_MODEL, MAX_TOKENS_GENERATE } from "./constants";
import { SYSTEM_PROMPT_GENERATE, buildGenerateUserPrompt } from "./prompts";
import { checkRateLimit } from "./rate-limiter";

interface GenerateInput {
  title: string;
  department: string;
  location: string;
  shiftType: string;
  experienceYears: number;
  tradeCategory: string;
  orgId: string;
}

function validateInput(data: unknown): GenerateInput {
  const d = data as Record<string, unknown>;

  if (!d.title || typeof d.title !== "string") {
    throw new HttpsError("invalid-argument", "title is required");
  }
  if (!d.department || typeof d.department !== "string") {
    throw new HttpsError("invalid-argument", "department is required");
  }
  if (!d.location || typeof d.location !== "string") {
    throw new HttpsError("invalid-argument", "location is required");
  }
  if (!d.shiftType || typeof d.shiftType !== "string") {
    throw new HttpsError("invalid-argument", "shiftType is required");
  }
  if (d.experienceYears == null || typeof d.experienceYears !== "number") {
    throw new HttpsError("invalid-argument", "experienceYears is required");
  }
  if (!d.tradeCategory || typeof d.tradeCategory !== "string") {
    throw new HttpsError("invalid-argument", "tradeCategory is required");
  }
  if (!d.orgId || typeof d.orgId !== "string") {
    throw new HttpsError("invalid-argument", "orgId is required");
  }

  return {
    title: String(d.title).trim(),
    department: String(d.department).trim(),
    location: String(d.location).trim(),
    shiftType: String(d.shiftType).trim(),
    experienceYears: Number(d.experienceYears),
    tradeCategory: String(d.tradeCategory).trim(),
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

export const generateJob = onCall(
  { timeoutSeconds: 60, memory: "256MiB" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required");
    }

    const input = validateInput(request.data);

    try {
      await checkRateLimit(input.orgId);
    } catch (err) {
      throw new HttpsError("resource-exhausted", (err as Error).message);
    }

    const client = getAnthropicClient();
    const userPrompt = buildGenerateUserPrompt(
      input.title, input.department, input.location,
      input.shiftType, input.experienceYears, input.tradeCategory,
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
      const hourlyPay = parsed.hourlyPayRange as Record<string, unknown> | undefined;

      return {
        title: String(parsed.title ?? ""),
        description: String(parsed.description ?? ""),
        requirements: Array.isArray(parsed.requirements) ? parsed.requirements.map(String) : [],
        physicalRequirements: Array.isArray(parsed.physicalRequirements) ? parsed.physicalRequirements.map(String) : [],
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications.map(String) : [],
        benefits: Array.isArray(parsed.benefits) ? parsed.benefits.map(String) : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills.map(String) : [],
        hourlyPayRange: {
          min: Number(hourlyPay?.min ?? 0),
          max: Number(hourlyPay?.max ?? 0),
          currency: String(hourlyPay?.currency ?? "USD"),
        },
        shiftSchedule: String(parsed.shiftSchedule ?? ""),
        experienceYears: Number(parsed.experienceYears ?? 0),
      };
    } catch (err) {
      logger.error("generateJob failed", { error: err, orgId: input.orgId });
      throw new HttpsError("internal", "AI generation failed. Please try again.");
    }
  },
);
