import * as admin from "firebase-admin";
import { MAX_REQUESTS_PER_HOUR, ONE_HOUR_MS } from "./constants";

/**
 * Check and increment the AI usage counter for an org.
 * Uses FieldValue.increment() for atomic updates (no transaction overhead).
 * Throws if rate limit exceeded.
 */
export async function checkRateLimit(orgId: string): Promise<void> {
  const db = admin.firestore();
  const today = new Date().toISOString().split("T")[0];
  const docRef = db.doc(`organizations/${orgId}/aiUsage/${today}`);

  const snap = await docRef.get();
  const now = Date.now();

  if (!snap.exists) {
    await docRef.set({ count: 1, windowStart: now });
    return;
  }

  const data = snap.data() as { count: number; windowStart: number };

  // Reset window if expired
  if (now - data.windowStart > ONE_HOUR_MS) {
    await docRef.set({ count: 1, windowStart: now });
    return;
  }

  if (data.count >= MAX_REQUESTS_PER_HOUR) {
    throw new Error(
      `Rate limit exceeded: ${MAX_REQUESTS_PER_HOUR} AI requests per hour per organization`,
    );
  }

  await docRef.update({ count: admin.firestore.FieldValue.increment(1) });
}
