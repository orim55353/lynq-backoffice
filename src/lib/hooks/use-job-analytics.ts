"use client";

import { useMemo } from "react";
import { MOCK_ANALYTICS, MOCK_JOBS } from "@/lib/data/mock-analytics";
import {
  computeJobPerformanceSummary,
  computeOrgBenchmarks,
} from "@/lib/hooks/transforms/job-analytics-transforms";

// ─── Types ────────────────────────────────────────────────────

interface AnalyticsDay {
  readonly date: string;
  readonly impressions: number;
  readonly scrollStops: number;
  readonly expands: number;
  readonly applies: number;
  readonly costPerApplicant: number;
}

interface DateRange {
  readonly start: string;
  readonly end: string;
}

interface PerformanceSummary {
  readonly jobId: string;
  readonly title: string;
  readonly status: string;
  readonly totalImpressions: number;
  readonly totalScrollStops: number;
  readonly totalExpands: number;
  readonly totalApplies: number;
  readonly scrollStopRate: number;
  readonly expandRate: number;
  readonly applyRate: number;
  readonly avgCostPerApplicant: number;
  readonly trend: "improving" | "declining" | "stable";
  readonly healthScore: number;
}

interface OrgBenchmarks {
  readonly avgScrollStopRate: number;
  readonly avgExpandRate: number;
  readonly avgApplyRate: number;
  readonly avgCostPerApplicant: number;
  readonly avgHealthScore: number;
}

// ─── useJobAnalytics ──────────────────────────────────────────

export function useJobAnalytics(jobId: string, dateRange?: DateRange) {
  const analytics = useMemo((): readonly AnalyticsDay[] => {
    const allDays = MOCK_ANALYTICS[jobId];
    if (!allDays) return [];

    if (!dateRange) return allDays;

    return allDays.filter(
      (day) => day.date >= dateRange.start && day.date <= dateRange.end,
    );
  }, [jobId, dateRange?.start, dateRange?.end]);

  return { analytics, isLoading: false } as const;
}

// ─── useJobPerformanceSummary ─────────────────────────────────

export function useJobPerformanceSummary(jobId: string) {
  const { analytics } = useJobAnalytics(jobId);

  const summary = useMemo((): PerformanceSummary | null => {
    const job = MOCK_JOBS.find((j) => j.id === jobId);
    if (!job || analytics.length === 0) return null;

    return computeJobPerformanceSummary(
      { id: job.id, title: job.title, status: job.status },
      analytics,
    );
  }, [jobId, analytics]);

  return { summary, isLoading: false } as const;
}

// ─── useJobsComparison ────────────────────────────────────────

export function useJobsComparison(jobIds?: readonly string[]) {
  const targetIds = jobIds ?? MOCK_JOBS.map((j) => j.id);

  const summaries = useMemo((): readonly PerformanceSummary[] => {
    return targetIds
      .map((id) => {
        const job = MOCK_JOBS.find((j) => j.id === id);
        const analytics = MOCK_ANALYTICS[id];
        if (!job || !analytics || analytics.length === 0) return null;

        return computeJobPerformanceSummary(
          { id: job.id, title: job.title, status: job.status },
          analytics,
        );
      })
      .filter((s): s is PerformanceSummary => s !== null);
  }, [targetIds]);

  const benchmarks = useMemo((): OrgBenchmarks => {
    return computeOrgBenchmarks(summaries);
  }, [summaries]);

  return { summaries, benchmarks, isLoading: false } as const;
}
