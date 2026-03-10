"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection } from "./use-firestore-subscription";
import { where } from "@/lib/firebase/firestore";
import { computeOverviewKpis, computeAnalyticsSummary } from "./transforms";
import { computeOverviewSparklines } from "./transforms/overview-sparkline-transforms";
import { useJobs } from "./use-jobs";
import { useApplications } from "./use-applications";
import type { AnalyticsEvent, JobAnalytics } from "@/lib/firebase/types";
import type { OverviewSparklines } from "./types";

export function useAnalyticsEvents() {
  const { orgId } = useAuth();

  return useFirestoreCollection<AnalyticsEvent>({
    queryKey: ["analytics", orgId],
    collectionPath: "analytics",
    constraints: orgId ? [where("orgId", "==", orgId)] : [],
    enabled: !!orgId,
  });
}

/** Aggregate all jobs' daily analytics from Firestore jobAnalytics collection. */
function useOrgDailyAnalytics() {
  const { orgId } = useAuth();

  const { data: rawAnalytics, isLoading } = useFirestoreCollection<JobAnalytics>({
    queryKey: ["jobAnalytics", orgId],
    collectionPath: "jobAnalytics",
    constraints: orgId ? [where("orgId", "==", orgId)] : [],
    enabled: !!orgId,
  });

  const analyticsMap = useMemo(() => {
    const map = new Map<string, readonly { date: string; impressions: number; scrollStops: number; expands: number; applies: number; costPerApplicant: number }[]>();
    if (!rawAnalytics) return map;

    const byJob = new Map<string, { date: string; impressions: number; scrollStops: number; expands: number; applies: number; costPerApplicant: number }[]>();
    for (const doc of rawAnalytics) {
      const day = {
        date: doc.date,
        impressions: doc.impressions,
        scrollStops: doc.scrollStops,
        expands: doc.expands,
        applies: doc.applies,
        costPerApplicant: doc.costPerApplicant,
      };
      const existing = byJob.get(doc.jobId);
      if (existing) {
        existing.push(day);
      } else {
        byJob.set(doc.jobId, [day]);
      }
    }

    // Sort each job's days and freeze into the result map
    for (const [jobId, days] of byJob.entries()) {
      map.set(jobId, days.sort((a, b) => a.date.localeCompare(b.date)));
    }

    return map;
  }, [rawAnalytics]);

  return { analyticsMap, isLoading };
}

export function useOverviewKpis() {
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: applications, isLoading: appsLoading } = useApplications();
  const { analyticsMap, isLoading: analyticsLoading } = useOrgDailyAnalytics();

  const kpis = useMemo(() => {
    if (!jobs || !applications) return null;
    return computeOverviewKpis(jobs, applications);
  }, [jobs, applications]);

  const sparklines: OverviewSparklines = useMemo(() => {
    return computeOverviewSparklines(analyticsMap);
  }, [analyticsMap]);

  return {
    data: kpis,
    sparklines,
    isLoading: jobsLoading || appsLoading || analyticsLoading,
  };
}

export function useAnalyticsSummary() {
  const { data: events, isLoading: eventsLoading } = useAnalyticsEvents();
  const { data: jobs, isLoading: jobsLoading } = useJobs();

  const summary = useMemo(() => {
    if (!events || !jobs) return null;
    return computeAnalyticsSummary(events, jobs);
  }, [events, jobs]);

  return {
    data: summary,
    isLoading: eventsLoading || jobsLoading,
  };
}
