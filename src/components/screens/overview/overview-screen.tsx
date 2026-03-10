"use client";

import { useRouter } from "next/navigation";
import {
  OverviewAlertsGrid,
  OverviewHeader,
  OverviewJobPerformanceTable,
  OverviewKpiGrid
} from "@/components/screens/overview/overview-sections";

export function OverviewScreen() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <OverviewHeader />
      <OverviewKpiGrid />
      <OverviewJobPerformanceTable
        onViewAllJobs={() => router.push("/jobs")}
        onOpenJob={(jobId) => router.push(`/jobs/${jobId}/edit`)}
      />
      <OverviewAlertsGrid />
    </div>
  );
}
