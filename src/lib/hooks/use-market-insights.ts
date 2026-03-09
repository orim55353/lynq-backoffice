"use client";

import { useMemo } from "react";
import { useJobs } from "./use-jobs";
import { useCandidates } from "./use-candidates";
import { useApplications } from "./use-applications";

export function useMarketInsights() {
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: candidates, isLoading: candidatesLoading } = useCandidates();
  const { data: applications, isLoading: appsLoading } = useApplications();

  const insights = useMemo(() => {
    if (!jobs || !candidates || !applications) return null;

    const salaryData = jobs
      .filter((j) => j.salaryMin && j.salaryMax)
      .slice(0, 5)
      .map((j) => ({
        role: j.title,
        market: Math.round(((j.salaryMin ?? 0) + (j.salaryMax ?? 0)) / 2 * 1.05),
        yours: Math.round(((j.salaryMin ?? 0) + (j.salaryMax ?? 0)) / 2),
      }));

    const locationCounts = new Map<string, number>();
    candidates.forEach((c) => {
      locationCounts.set(c.location, (locationCounts.get(c.location) ?? 0) + 1);
    });

    const regionalDemand = Array.from(locationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([region, count]) => ({
        region,
        demand: Math.min(99, Math.round((count / candidates.length) * 200)),
        avgSalary: "—",
        competition: count > 3 ? "Very High" : count > 1 ? "High" : "Medium",
      }));

    return { salaryData, regionalDemand };
  }, [jobs, candidates, applications]);

  return {
    data: insights,
    isLoading: jobsLoading || candidatesLoading || appsLoading,
  };
}
