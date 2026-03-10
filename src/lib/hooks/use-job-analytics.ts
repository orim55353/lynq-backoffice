"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection } from "./use-firestore-subscription";
import { where } from "@/lib/firebase/firestore";
import { useJob, useJobs } from "./use-jobs";
import {
  computeJobPerformanceSummary,
  computeOrgBenchmarks,
} from "./transforms/job-analytics-transforms";
import type { JobAnalytics } from "@/lib/firebase/types";

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


// ─── Internal helper ──────────────────────────────────────────

function useJobAnalyticsCollection(jobId?: string) {
  const { orgId } = useAuth();

  const constraints = useMemo(() => {
    if (!orgId) return [];
    if (jobId) {
      return [where("orgId", "==", orgId), where("jobId", "==", jobId)];
    }
    return [where("orgId", "==", orgId)];
  }, [orgId, jobId]);

  return useFirestoreCollection<JobAnalytics>({
    queryKey: jobId
      ? ["jobAnalytics", orgId, jobId]
      : ["jobAnalytics", orgId],
    collectionPath: "jobAnalytics",
    constraints,
    enabled: !!orgId,
  });
}

function toAnalyticsDay(doc: JobAnalytics): AnalyticsDay {
  return {
    date: doc.date,
    impressions: doc.impressions,
    scrollStops: doc.scrollStops,
    expands: doc.expands,
    applies: doc.applies,
    costPerApplicant: doc.costPerApplicant,
  };
}

// ─── useJobAnalytics ──────────────────────────────────────────

export function useJobAnalytics(jobId: string, dateRange?: DateRange) {
  const { data: rawDocs, isLoading } = useJobAnalyticsCollection(jobId);

  const analytics = useMemo((): readonly AnalyticsDay[] => {
    if (!rawDocs) return [];

    const sorted = rawDocs
      .map(toAnalyticsDay)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!dateRange) return sorted;

    return sorted.filter(
      (day) => day.date >= dateRange.start && day.date <= dateRange.end,
    );
  }, [rawDocs, dateRange]);

  return { analytics, isLoading } as const;
}

// ─── useJobPerformanceSummary ─────────────────────────────────

export function useJobPerformanceSummary(jobId: string) {
  const { analytics, isLoading: analyticsLoading } = useJobAnalytics(jobId);
  const { data: job, isLoading: jobLoading } = useJob(jobId);

  const summary = useMemo((): PerformanceSummary | null => {
    if (!job || analytics.length === 0) return null;

    return computeJobPerformanceSummary(
      { id: job.id, title: job.title, status: job.status },
      analytics,
    );
  }, [job, analytics]);

  return { summary, isLoading: analyticsLoading || jobLoading } as const;
}

// ─── useJobsComparison ────────────────────────────────────────

export function useJobsComparison(jobIds?: readonly string[]) {
  const { data: allDocs, isLoading: analyticsLoading } =
    useJobAnalyticsCollection();
  const { data: jobs, isLoading: jobsLoading } = useJobs();

  const result = useMemo(() => {
    if (!allDocs || !jobs) {
      return {
        summaries: [] as readonly PerformanceSummary[],
        benchmarks: computeOrgBenchmarks([]),
      };
    }

    // Group analytics by jobId
    const byJob = new Map<string, AnalyticsDay[]>();
    for (const doc of allDocs) {
      if (jobIds && !jobIds.includes(doc.jobId)) continue;
      const existing = byJob.get(doc.jobId);
      const day = toAnalyticsDay(doc);
      if (existing) {
        existing.push(day);
      } else {
        byJob.set(doc.jobId, [day]);
      }
    }

    const summaries: PerformanceSummary[] = [];
    for (const [jobId, days] of byJob.entries()) {
      const job = jobs.find((j) => j.id === jobId);
      if (!job || days.length === 0) continue;

      summaries.push(
        computeJobPerformanceSummary(
          { id: job.id, title: job.title, status: job.status },
          days.sort((a, b) => a.date.localeCompare(b.date)),
        ),
      );
    }

    return {
      summaries,
      benchmarks: computeOrgBenchmarks(summaries),
    };
  }, [allDocs, jobs, jobIds]);

  return {
    summaries: result.summaries,
    benchmarks: result.benchmarks,
    isLoading: analyticsLoading || jobsLoading,
  } as const;
}
