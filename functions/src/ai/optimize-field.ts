import * as functions from "firebase-functions";
import { getAnthropicClient } from "./client";
import { FAST_MODEL, MAX_TOKENS_OPTIMIZE } from "./constants";
import { SYSTEM_PROMPT_OPTIMIZE } from "./prompts";
import { checkRateLimit } from "./rate-limiter";

const ALLOWED_FIELDS = ["title", "hook", "description", "requirements", "benefits", "skills"];

interface OptimizeInput {
  field: string;
  currentValue: string;
  context: Record<string, unknown>;
  orgId: string;
}

function validateInput(data: unknown): OptimizeInput {
  const d = data as Record<string, unknown>;

  if (!d.field || typeof d.field !== "string" || !ALLOWED_FIELDS.includes(d.field)) {
    throw new functions.https.HttpsError("invalid-argument", `field must be one of: ${ALLOWED_FIELDS.join(", ")}`);
  }
  if (typeof d.currentValue !== "string" || !d.currentValue.trim()) {
    throw new functions.https.HttpsError("invalid-argument", "currentValue is required");
  }
  if (!d.orgId || typeof d.orgId !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "orgId is required");
  }

  return {
    field: String(d.field),
    currentValue: String(d.currentValue).trim(),
    context: (d.context as Record<string, unknown>) ?? {},
    orgId: String(d.orgId),
  };
}

function parseResponse(text: string): { optimizedValue: string; reasoning: string; confidenceScore: number } {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No parseable JSON");
    parsed = JSON.parse(match[0]);
  }

  return {
    optimizedValue: String(parsed.optimizedValue ?? ""),
    reasoning: String(parsed.reasoning ?? ""),
    confidenceScore: Math.min(1, Math.max(0, Number(parsed.confidenceScore ?? 0.8))),
  };
}

export const optimizeField = functions
  .runWith({ timeoutSeconds: 30, memory: "256MB" })
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
    const contextSummary = Object.entries(input.context)
      .filter(([k]) => k !== input.field)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join("\n");

    const userPrompt = `Optimize the "${input.field}" field.\n\nCurrent value:\n${input.currentValue}\n\nFull job context:\n${contextSummary}`;

    try {
      const message = await client.messages.create({
        model: FAST_MODEL,
        max_tokens: MAX_TOKENS_OPTIMIZE,
        system: SYSTEM_PROMPT_OPTIMIZE,
        messages: [{ role: "user", content: userPrompt }],
      });

      const content = message.content[0];
      if (content.type !== "text") throw new Error("Unexpected response type");

      return parseResponse(content.text);
    } catch (err) {
      functions.logger.error("optimizeField failed", { error: err, field: input.field });
      throw new functions.https.HttpsError("internal", "AI optimization failed. Please try again.");
    }
  });
