"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection } from "./use-firestore-subscription";
import { where } from "@/lib/firebase/firestore";
import { computeOverviewKpis, computeAnalyticsSummary } from "./transforms";
import { useJobs } from "./use-jobs";
import { useApplications } from "./use-applications";
import type { AnalyticsEvent } from "@/lib/firebase/types";

export function useAnalyticsEvents() {
  const { orgId } = useAuth();

  return useFirestoreCollection<AnalyticsEvent>({
    queryKey: ["analytics", orgId],
    collectionPath: "analytics",
    constraints: orgId ? [where("orgId", "==", orgId)] : [],
    enabled: !!orgId,
  });
}

export function useOverviewKpis() {
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: applications, isLoading: appsLoading } = useApplications();

  const kpis = useMemo(() => {
    if (!jobs || !applications) return null;
    return computeOverviewKpis(jobs, applications);
  }, [jobs, applications]);

  return {
    data: kpis,
    isLoading: jobsLoading || appsLoading,
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
