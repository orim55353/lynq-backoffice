// ─── Overview Sparkline Transforms — Pure Functions ────────────
// Aggregates daily per-job analytics into org-level sparklines + change %.

interface AnalyticsDay {
  readonly date: string;
  readonly impressions: number;
  readonly scrollStops: number;
  readonly expands: number;
  readonly applies: number;
  readonly costPerApplicant: number;
}

interface SparklineEntry {
  readonly sparkline: readonly number[];
  readonly change: number;
}

export interface OverviewSparklines {
  readonly activeJobs: SparklineEntry;
  readonly totalImpressions: SparklineEntry;
  readonly avgDwellTime: SparklineEntry;
  readonly applyRate: SparklineEntry;
  readonly costPerApplicant: SparklineEntry;
  readonly timeToHire: SparklineEntry;
}

interface DailyAggregate {
  readonly date: string;
  readonly impressions: number;
  readonly applies: number;
  readonly costTotal: number;
  readonly appliesForCpa: number;
  readonly activeJobCount: number;
}

/** Aggregate all jobs' daily analytics by date. */
function aggregateByDate(
  allJobAnalytics: ReadonlyMap<string, readonly AnalyticsDay[]>,
): readonly DailyAggregate[] {
  const dateMap = new Map<string, { impressions: number; applies: number; costTotal: number; appliesForCpa: number; jobIds: Set<string> }>();

  for (const [jobId, days] of allJobAnalytics.entries()) {
    for (const day of days) {
      const existing = dateMap.get(day.date);
      if (existing) {
        existing.impressions += day.impressions;
        existing.applies += day.applies;
        existing.costTotal += day.costPerApplicant * day.applies;
        existing.appliesForCpa += day.applies;
        existing.jobIds.add(jobId);
      } else {
        dateMap.set(day.date, {
          impressions: day.impressions,
          applies: day.applies,
          costTotal: day.costPerApplicant * day.applies,
          appliesForCpa: day.applies,
          jobIds: new Set([jobId]),
        });
      }
    }
  }

  return Array.from(dateMap.entries())
    .map(([date, agg]) => ({
      date,
      impressions: agg.impressions,
      applies: agg.applies,
      costTotal: agg.costTotal,
      appliesForCpa: agg.appliesForCpa,
      activeJobCount: agg.jobIds.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Compute 7-day period-over-period change %. */
function computeChange(values: readonly number[]): number {
  if (values.length < 14) return 0;

  const last14 = values.slice(-14);
  const prevWeek = last14.slice(0, 7);
  const currWeek = last14.slice(7);

  const prevAvg = prevWeek.reduce((s, v) => s + v, 0) / 7;
  const currAvg = currWeek.reduce((s, v) => s + v, 0) / 7;

  if (prevAvg === 0) return 0;
  return Math.round(((currAvg - prevAvg) / prevAvg) * 1000) / 10;
}

const EMPTY_ENTRY: SparklineEntry = { sparkline: [], change: 0 };

/**
 * Transform per-job daily analytics into overview sparklines + change values.
 * @param allJobAnalytics Map of jobId → daily analytics array
 * @param days Number of trailing days for sparkline (default 14)
 */
export function computeOverviewSparklines(
  allJobAnalytics: ReadonlyMap<string, readonly AnalyticsDay[]>,
  days: number = 14,
): OverviewSparklines {
  const aggregated = aggregateByDate(allJobAnalytics);

  if (aggregated.length === 0) {
    return {
      activeJobs: EMPTY_ENTRY,
      totalImpressions: EMPTY_ENTRY,
      avgDwellTime: EMPTY_ENTRY,
      applyRate: EMPTY_ENTRY,
      costPerApplicant: EMPTY_ENTRY,
      timeToHire: EMPTY_ENTRY,
    };
  }

  const trailing = aggregated.slice(-days);

  const activeJobValues = trailing.map((d) => d.activeJobCount);
  const impressionValues = trailing.map((d) => d.impressions);
  const applyRateValues = trailing.map((d) =>
    d.impressions > 0 ? (d.applies / d.impressions) * 100 : 0,
  );
  const cpaValues = trailing.map((d) =>
    d.appliesForCpa > 0 ? d.costTotal / d.appliesForCpa : 0,
  );

  // Use all aggregated days (not just trailing) for change calculation
  const allActiveJobs = aggregated.map((d) => d.activeJobCount);
  const allImpressions = aggregated.map((d) => d.impressions);
  const allApplyRates = aggregated.map((d) =>
    d.impressions > 0 ? (d.applies / d.impressions) * 100 : 0,
  );
  const allCpaValues = aggregated.map((d) =>
    d.appliesForCpa > 0 ? d.costTotal / d.appliesForCpa : 0,
  );

  return {
    activeJobs: {
      sparkline: activeJobValues,
      change: computeChange(allActiveJobs),
    },
    totalImpressions: {
      sparkline: impressionValues,
      change: computeChange(allImpressions),
    },
    // No dwell time data available
    avgDwellTime: EMPTY_ENTRY,
    applyRate: {
      sparkline: applyRateValues,
      change: computeChange(allApplyRates),
    },
    costPerApplicant: {
      sparkline: cpaValues,
      change: computeChange(allCpaValues),
    },
    // No time-to-hire data available
    timeToHire: EMPTY_ENTRY,
  };
}
