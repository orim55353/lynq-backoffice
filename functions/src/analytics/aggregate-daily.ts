import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";

/**
 * Nightly aggregation of analytics events → jobAnalytics documents.
 *
 * Runs every day at 02:00 UTC. For each org with active jobs, aggregates
 * yesterday's analytics events into one `jobAnalytics` doc per job.
 *
 * Current mapping:
 *   - `impressions`      ← count of `job_view` events (proxy until `job_impression` exists)
 *   - `applies`          ← count of `job_apply` events
 *   - `scrollStops`      ← 0 (future: `job_scroll_stop` event)
 *   - `expands`          ← 0 (future: `job_expand` event)
 *   - `costPerApplicant` ← derived from campaign spend for the job
 */
export const aggregateDailyJobAnalytics = onSchedule(
  {
    schedule: "every day 03:00",
    timeZone: "America/New_York",
    timeoutSeconds: 300,
    memory: "256MiB",
  },
  async () => {
    const db = admin.firestore();

    const yesterday = getYesterdayDate();
    logger.info(`Aggregating job analytics for ${yesterday}`);

    // 1. Get all events from yesterday
    const startOfDay = new Date(`${yesterday}T00:00:00Z`);
    const endOfDay = new Date(`${yesterday}T23:59:59.999Z`);

    const eventsSnap = await db
      .collection("analytics")
      .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(startOfDay))
      .where("timestamp", "<=", admin.firestore.Timestamp.fromDate(endOfDay))
      .get();

    if (eventsSnap.empty) {
      logger.info("No analytics events found for yesterday, skipping.");
      return;
    }

    // 2. Group events by orgId + jobId
    const counters = new Map<string, { orgId: string; jobId: string; impressions: number; applies: number }>();

    for (const doc of eventsSnap.docs) {
      const data = doc.data();
      const { orgId, jobId, eventType } = data;
      if (!orgId || !jobId) continue;

      const key = `${orgId}::${jobId}`;
      const entry = counters.get(key) ?? { orgId, jobId, impressions: 0, applies: 0 };

      if (eventType === "job_view") {
        entry.impressions += 1;
      } else if (eventType === "job_apply") {
        entry.applies += 1;
      }

      counters.set(key, entry);
    }

    if (counters.size === 0) {
      logger.info("No job-related events to aggregate.");
      return;
    }

    // 3. Gather all unique jobIds to look up campaign CPA
    const jobIds = new Set<string>();
    for (const entry of counters.values()) {
      jobIds.add(entry.jobId);
    }
    const cpaByJob = await computeCpaByJob(db, jobIds);

    // 4. Write jobAnalytics docs in batches
    let batch = db.batch();
    let batchCount = 0;
    let totalDocs = 0;

    for (const entry of counters.values()) {
      const docId = `${entry.jobId}-${yesterday}`;
      const ref = db.collection("jobAnalytics").doc(docId);
      const cpa = cpaByJob.get(entry.jobId) ?? 0;

      batch.set(
        ref,
        {
          orgId: entry.orgId,
          jobId: entry.jobId,
          date: yesterday,
          impressions: entry.impressions,
          scrollStops: 0, // Future: aggregate from job_scroll_stop events
          expands: 0, // Future: aggregate from job_expand events
          applies: entry.applies,
          costPerApplicant: entry.applies > 0 ? Math.round((cpa / entry.applies) * 100) / 100 : 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      batchCount++;
      totalDocs++;

      // Firestore batch limit is 500
      if (batchCount >= 400) {
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    logger.info(`Aggregated ${totalDocs} jobAnalytics docs for ${yesterday}`);
  },
);

/** Returns yesterday's date as YYYY-MM-DD string. */
function getYesterdayDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split("T")[0];
}

/**
 * Compute daily cost per applicant for each job from active campaigns.
 * Uses total campaign spend / total campaign applications as a proxy.
 * Returns a Map<jobId, dailyCost> where dailyCost is the average daily spend.
 */
async function computeCpaByJob(
  db: admin.firestore.Firestore,
  jobIds: Set<string>,
): Promise<Map<string, number>> {
  const cpaMap = new Map<string, number>();
  if (jobIds.size === 0) return cpaMap;

  // Query active campaigns for these jobs
  const campaignSnap = await db
    .collection("campaigns")
    .where("status", "==", "active")
    .get();

  for (const doc of campaignSnap.docs) {
    const data = doc.data();
    if (!jobIds.has(data.jobId)) continue;

    const startDate = data.startDate?.toDate?.();
    const endDate = data.endDate?.toDate?.();
    if (!startDate || !endDate) continue;

    const durationDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)));
    const dailySpend = (data.spent ?? 0) / durationDays;

    // Accumulate daily spend across campaigns for the same job
    const existing = cpaMap.get(data.jobId) ?? 0;
    cpaMap.set(data.jobId, existing + dailySpend);
  }

  return cpaMap;
}
