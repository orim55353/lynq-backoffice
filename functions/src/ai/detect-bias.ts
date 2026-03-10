import * as functions from "firebase-functions";
import { getAnthropicClient } from "./client";
import { FAST_MODEL, MAX_TOKENS_SCORE } from "./constants";
import { SYSTEM_PROMPT_BIAS } from "./prompts";
import { checkRateLimit } from "./rate-limiter";

export const detectBias = functions
  .runWith({ timeoutSeconds: 30, memory: "256MB" })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Authentication required");
    }

    const { text, orgId } = data as { text: string; orgId: string };
    if (!orgId) throw new functions.https.HttpsError("invalid-argument", "orgId is required");
    if (!text || typeof text !== "string") throw new functions.https.HttpsError("invalid-argument", "text is required");
    if (text.trim().length < 10) return { issues: [] };

    try {
      await checkRateLimit(orgId);
    } catch (err) {
      throw new functions.https.HttpsError("resource-exhausted", (err as Error).message);
    }

    try {
      const client = getAnthropicClient();
      const message = await client.messages.create({
        model: FAST_MODEL,
        max_tokens: MAX_TOKENS_SCORE,
        system: SYSTEM_PROMPT_BIAS,
        messages: [{ role: "user", content: `Analyze for bias:\n${text}` }],
      });

      const content = message.content[0];
      if (content.type !== "text") return { issues: [] };

      const parsed = JSON.parse(content.text);
      if (!Array.isArray(parsed)) return { issues: [] };

      // Add approximate positions
      const issues = parsed.map((issue: Record<string, unknown>) => ({
        text: String(issue.text ?? ""),
        type: String(issue.type ?? "gendered"),
        suggestion: String(issue.suggestion ?? ""),
        severity: String(issue.severity ?? "medium"),
        position: issue.text ? text.toLowerCase().indexOf(String(issue.text).toLowerCase()) : -1,
      }));

      return { issues };
    } catch (err) {
      functions.logger.error("detectBias failed", { error: err });
      return { issues: [] }; // Graceful degradation
    }
  });
