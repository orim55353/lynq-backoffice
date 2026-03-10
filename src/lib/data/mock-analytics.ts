// ─── Deterministic Mock Analytics Data ─────────────────────────
// Uses seeded PRNG — no Math.random(). Same output every time.

interface AnalyticsDay {
  date: string;
  impressions: number;
  scrollStops: number;
  expands: number;
  applies: number;
  costPerApplicant: number;
}

interface MockJob {
  readonly id: string;
  readonly title: string;
  readonly status: string;
}

// ─── Seeded PRNG ───────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ─── Mock Jobs ─────────────────────────────────────────────────

export const MOCK_JOBS: readonly MockJob[] = [
  { id: "1", title: "Senior Product Designer", status: "active" },
  { id: "2", title: "Frontend Engineer (React)", status: "active" },
  { id: "3", title: "Marketing Manager", status: "active" },
  { id: "4", title: "Data Analyst", status: "paused" },
  { id: "5", title: "Customer Success Lead", status: "active" },
  { id: "6", title: "DevOps Engineer", status: "active" },
  { id: "7", title: "Content Writer", status: "active" },
  { id: "8", title: "Sales Executive", status: "paused" },
] as const;

// ─── Data Generation ───────────────────────────────────────────

interface JobProfile {
  baseImpressions: number;
  scrollStopRate: number;
  expandRate: number;
  applyRate: number;
  baseCpa: number;
  trendDir: number; // -1 declining, 0 stable, 1 improving
}

const JOB_PROFILES: Record<string, JobProfile> = {
  "1": { baseImpressions: 420, scrollStopRate: 0.32, expandRate: 0.18, applyRate: 0.042, baseCpa: 48, trendDir: 1 },
  "2": { baseImpressions: 330, scrollStopRate: 0.28, expandRate: 0.15, applyRate: 0.032, baseCpa: 52, trendDir: 0 },
  "3": { baseImpressions: 520, scrollStopRate: 0.38, expandRate: 0.22, applyRate: 0.048, baseCpa: 39, trendDir: 1 },
  "4": { baseImpressions: 150, scrollStopRate: 0.18, expandRate: 0.09, applyRate: 0.018, baseCpa: 88, trendDir: -1 },
  "5": { baseImpressions: 245, scrollStopRate: 0.31, expandRate: 0.16, applyRate: 0.035, baseCpa: 57, trendDir: 0 },
  "6": { baseImpressions: 298, scrollStopRate: 0.26, expandRate: 0.14, applyRate: 0.025, baseCpa: 61, trendDir: -1 },
  "7": { baseImpressions: 375, scrollStopRate: 0.34, expandRate: 0.19, applyRate: 0.044, baseCpa: 44, trendDir: 1 },
  "8": { baseImpressions: 115, scrollStopRate: 0.15, expandRate: 0.08, applyRate: 0.021, baseCpa: 79, trendDir: -1 },
};

function generateDailyAnalytics(jobId: string): readonly AnalyticsDay[] {
  const profile = JOB_PROFILES[jobId];
  if (!profile) return [];

  const days: AnalyticsDay[] = [];
  const baseDate = new Date("2026-03-09");

  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const seed = parseInt(jobId, 10) * 1000 + i;
    const noise = 0.85 + seededRandom(seed) * 0.3;
    const trendEffect = i < 7 ? 1 + profile.trendDir * 0.08 : 1;

    const impressions = Math.round(profile.baseImpressions * noise * trendEffect);
    const scrollStops = Math.round(impressions * profile.scrollStopRate * (0.9 + seededRandom(seed + 1) * 0.2));
    const expands = Math.round(impressions * profile.expandRate * (0.9 + seededRandom(seed + 2) * 0.2));
    const applies = Math.round(impressions * profile.applyRate * trendEffect * (0.85 + seededRandom(seed + 3) * 0.3));
    const cpa = Math.round(profile.baseCpa * (0.9 + seededRandom(seed + 4) * 0.2) * 100) / 100;

    days.push({ date: dateStr, impressions, scrollStops, expands, applies, costPerApplicant: cpa });
  }

  return days;
}

// ─── Export ────────────────────────────────────────────────────

export const MOCK_ANALYTICS: Readonly<Record<string, readonly AnalyticsDay[]>> = {
  "1": generateDailyAnalytics("1"),
  "2": generateDailyAnalytics("2"),
  "3": generateDailyAnalytics("3"),
  "4": generateDailyAnalytics("4"),
  "5": generateDailyAnalytics("5"),
  "6": generateDailyAnalytics("6"),
  "7": generateDailyAnalytics("7"),
  "8": generateDailyAnalytics("8"),
};
