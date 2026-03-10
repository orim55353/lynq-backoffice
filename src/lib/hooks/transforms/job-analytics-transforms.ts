// ─── Job Analytics Transforms — Pure Functions ────────────────
// Zero React/Firebase dependencies. All immutable.

// ─── Local Interfaces ──────────────────────────────────────────

interface AnalyticsDay {
  date: string;
  impressions: number;
  scrollStops: number;
  expands: number;
  applies: number;
  costPerApplicant: number;
}

interface FunnelData {
  impressions: number;
  scrollStops: number;
  expands: number;
  applies: number;
  scrollStopRate: number;
  expandRate: number;
  applyRate: number;
}

interface PerformanceSummary {
  jobId: string;
  title: string;
  status: string;
  totalImpressions: number;
  totalScrollStops: number;
  totalExpands: number;
  totalApplies: number;
  scrollStopRate: number;
  expandRate: number;
  applyRate: number;
  avgCostPerApplicant: number;
  trend: "improving" | "declining" | "stable";
  healthScore: number;
}

interface OrgBenchmarks {
  avgScrollStopRate: number;
  avgExpandRate: number;
  avgApplyRate: number;
  avgCostPerApplicant: number;
  avgHealthScore: number;
}

interface ComparisonResult {
  metric: string;
  yourValue: number;
  orgAvg: number;
  deltaPercent: number;
  isAboveAvg: boolean;
}

interface Recommendation {
  id: string;
  severity: "high" | "medium" | "low";
  icon: "trending-down" | "alert-circle" | "dollar-sign" | "users" | "zap";
  message: string;
  action: string;
  actionRoute?: string;
}

// ─── Core Functions ────────────────────────────────────────────

/** Aggregate daily analytics into a single funnel summary. */
export function computeJobFunnel(analytics: readonly AnalyticsDay[]): FunnelData {
  if (analytics.length === 0) {
    return { impressions: 0, scrollStops: 0, expands: 0, applies: 0, scrollStopRate: 0, expandRate: 0, applyRate: 0 };
  }

  const totals = analytics.reduce(
    (acc, day) => ({
      impressions: acc.impressions + day.impressions,
      scrollStops: acc.scrollStops + day.scrollStops,
      expands: acc.expands + day.expands,
      applies: acc.applies + day.applies,
    }),
    { impressions: 0, scrollStops: 0, expands: 0, applies: 0 },
  );

  const imp = totals.impressions || 1;
  return {
    ...totals,
    scrollStopRate: (totals.scrollStops / imp) * 100,
    expandRate: (totals.expands / imp) * 100,
    applyRate: (totals.applies / imp) * 100,
  };
}

/** Compare last 7 days vs previous 7 days apply rate. */
export function computeJobTrend(analytics: readonly AnalyticsDay[]): "improving" | "declining" | "stable" {
  const sorted = [...analytics].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 7) return "stable";

  const last7 = sorted.slice(-7);
  const prev7 = sorted.slice(-14, -7);
  if (prev7.length === 0) return "stable";

  const rate = (days: AnalyticsDay[]) => {
    const imp = days.reduce((s, d) => s + d.impressions, 0);
    const app = days.reduce((s, d) => s + d.applies, 0);
    return imp > 0 ? app / imp : 0;
  };

  const lastRate = rate(last7);
  const prevRate = rate(prev7);
  if (prevRate === 0) return "stable";

  const delta = (lastRate - prevRate) / prevRate;
  if (delta > 0.05) return "improving";
  if (delta < -0.05) return "declining";
  return "stable";
}

/** Health score from funnel rates. Targets: scrollStop 30%, expand 15%, apply 3%. */
export function computeHealthScore(scrollStopRate: number, expandRate: number, applyRate: number): number {
  const s = Math.min((scrollStopRate / 30) * 100, 100);
  const e = Math.min((expandRate / 15) * 100, 100);
  const a = Math.min((applyRate / 3) * 100, 100);
  return Math.round(s * 0.3 + e * 0.3 + a * 0.4);
}

/** Full performance summary for a single job. */
export function computeJobPerformanceSummary(
  job: { id: string; title: string; status: string },
  analytics: readonly AnalyticsDay[],
): PerformanceSummary {
  const funnel = computeJobFunnel(analytics);
  const trend = computeJobTrend(analytics);
  const healthScore = computeHealthScore(funnel.scrollStopRate, funnel.expandRate, funnel.applyRate);
  const avgCpa = analytics.length > 0
    ? analytics.reduce((sum, d) => sum + d.costPerApplicant, 0) / analytics.length
    : 0;

  return {
    jobId: job.id,
    title: job.title,
    status: job.status,
    totalImpressions: funnel.impressions,
    totalScrollStops: funnel.scrollStops,
    totalExpands: funnel.expands,
    totalApplies: funnel.applies,
    scrollStopRate: funnel.scrollStopRate,
    expandRate: funnel.expandRate,
    applyRate: funnel.applyRate,
    avgCostPerApplicant: avgCpa,
    trend,
    healthScore,
  };
}

/** Org-wide averages from all job summaries. */
export function computeOrgBenchmarks(summaries: readonly PerformanceSummary[]): OrgBenchmarks {
  if (summaries.length === 0) {
    return { avgScrollStopRate: 0, avgExpandRate: 0, avgApplyRate: 0, avgCostPerApplicant: 0, avgHealthScore: 0 };
  }
  const n = summaries.length;
  return {
    avgScrollStopRate: summaries.reduce((s, j) => s + j.scrollStopRate, 0) / n,
    avgExpandRate: summaries.reduce((s, j) => s + j.expandRate, 0) / n,
    avgApplyRate: summaries.reduce((s, j) => s + j.applyRate, 0) / n,
    avgCostPerApplicant: summaries.reduce((s, j) => s + j.avgCostPerApplicant, 0) / n,
    avgHealthScore: summaries.reduce((s, j) => s + j.healthScore, 0) / n,
  };
}

/** Delta percentages vs org average (CPA is inverted — lower is better). */
export function compareToOrg(summary: PerformanceSummary, benchmarks: OrgBenchmarks): ComparisonResult[] {
  const make = (metric: string, yours: number, org: number, inverted = false): ComparisonResult => {
    const delta = org > 0 ? ((yours - org) / org) * 100 : 0;
    return { metric, yourValue: yours, orgAvg: org, deltaPercent: delta, isAboveAvg: inverted ? delta < 0 : delta > 0 };
  };
  return [
    make("Scroll Stop Rate", summary.scrollStopRate, benchmarks.avgScrollStopRate),
    make("Expand Rate", summary.expandRate, benchmarks.avgExpandRate),
    make("Apply Rate", summary.applyRate, benchmarks.avgApplyRate),
    make("Cost per Applicant", summary.avgCostPerApplicant, benchmarks.avgCostPerApplicant, true),
  ];
}

/** Rule-based recommendations for underperforming jobs. */
export function computeRecommendations(summary: PerformanceSummary, benchmarks: OrgBenchmarks): Recommendation[] {
  const recs: Recommendation[] = [];

  if (benchmarks.avgApplyRate > 0 && summary.applyRate < benchmarks.avgApplyRate * 0.7) {
    const pct = Math.round(((benchmarks.avgApplyRate - summary.applyRate) / benchmarks.avgApplyRate) * 100);
    recs.push({
      id: "apply-rate-low", severity: "high", icon: "trending-down",
      message: `Your apply rate (${summary.applyRate.toFixed(1)}%) is ${pct}% below the org average. Consider A/B testing your hook.`,
      action: "Run A/B Test", actionRoute: `/jobs/${summary.jobId}/ab-test`,
    });
  }

  if (summary.totalApplies === 0 && summary.totalImpressions > 0) {
    recs.push({
      id: "zero-applies", severity: "high", icon: "alert-circle",
      message: "This job has 0 applies. Consider updating the salary range or job description.",
      action: "Edit Job", actionRoute: `/jobs/${summary.jobId}/edit`,
    });
  }

  if (benchmarks.avgCostPerApplicant > 0 && summary.avgCostPerApplicant > benchmarks.avgCostPerApplicant * 1.25) {
    const pct = Math.round(((summary.avgCostPerApplicant - benchmarks.avgCostPerApplicant) / benchmarks.avgCostPerApplicant) * 100);
    recs.push({
      id: "cpa-high", severity: "medium", icon: "dollar-sign",
      message: `Cost per applicant ($${Math.round(summary.avgCostPerApplicant)}) is ${pct}% above org average.`,
      action: "View Sponsored", actionRoute: "/sponsored",
    });
  }

  if (summary.scrollStopRate < 20) {
    recs.push({
      id: "scroll-stop-low", severity: "medium", icon: "zap",
      message: `Low scroll stop rate (${summary.scrollStopRate.toFixed(1)}%). A stronger hook headline could improve visibility.`,
      action: "Edit Job", actionRoute: `/jobs/${summary.jobId}/edit`,
    });
  }

  if (summary.healthScore < 60) {
    recs.push({
      id: "health-low", severity: "low", icon: "users",
      message: `Overall health score is low (${summary.healthScore}/100). Review all funnel stages for improvement.`,
      action: "View Analytics",
    });
  }

  return recs;
}
