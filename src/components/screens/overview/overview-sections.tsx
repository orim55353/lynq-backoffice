"use client";

import { useMemo } from "react";
import { ArrowRight, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertCard } from "@/components/dashboard/alert-card";
import { DataTable, HealthScoreBadge, StatusBadge, type DataTableColumn } from "@/components/dashboard/data-table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useOverviewKpis } from "@/lib/hooks/use-analytics";
import { useJobs } from "@/lib/hooks/use-jobs";
import { jobToDisplayRow } from "@/lib/hooks/transforms";
import { SkeletonKpiGrid } from "@/components/skeletons/skeleton-kpi-grid";
import { SkeletonDataTable } from "@/components/skeletons/skeleton-data-table";
import { EmptyState } from "@/components/ui/empty-state";
import type { JobDisplayRow } from "@/lib/hooks/types";

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${Math.round(num / 1000)}K`;
  return num.toString();
}

const jobColumns: DataTableColumn<JobDisplayRow>[] = [
  {
    id: "title",
    header: "Job Title",
    width: "25%",
    cell: (row) => <span className="font-medium">{row.title}</span>
  },
  {
    id: "status",
    header: "Status",
    width: "10%",
    cell: (row) => <StatusBadge status={row.status} />
  },
  { id: "impressions", header: "Impressions", width: "12%", cell: (row) => row.impressions },
  { id: "dwellTime", header: "Dwell Time", width: "12%", cell: (row) => row.dwellTime },
  {
    id: "applyRate",
    header: "Apply Rate",
    width: "12%",
    cell: (row) => <span className="font-medium text-success">{row.applyRate}</span>
  },
  {
    id: "healthScore",
    header: "Health Score",
    width: "15%",
    cell: (row) => <HealthScoreBadge score={row.healthScore} />
  },
  {
    id: "boosted",
    header: "Boost",
    width: "14%",
    cell: (row) =>
      row.boosted ? (
        <Badge className="border-0 bg-info/10 text-info">Boosted</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
  }
];

export function OverviewHeader() {
  return (
    <div>
      <h1 className="mb-1">Overview</h1>
      <p className="text-sm text-muted-foreground">Your hiring performance at a glance</p>
    </div>
  );
}

export function OverviewKpiGrid() {
  const { data: kpis, isLoading } = useOverviewKpis();

  if (isLoading) {
    return <SkeletonKpiGrid />;
  }

  const kpiCards = [
    {
      title: "Active Jobs",
      value: kpis?.activeJobs ?? 0,
      change: 0,
      sparklineData: [] as number[],
    },
    {
      title: "Total Impressions",
      value: kpis ? formatNumber(kpis.totalImpressions) : "0",
      change: 0,
      sparklineData: [] as number[],
    },
    {
      title: "Avg Dwell Time",
      value: kpis ? `${kpis.avgDwellTime.toFixed(1)}s` : "0s",
      change: 0,
      sparklineData: [] as number[],
    },
    {
      title: "Apply Rate",
      value: kpis ? `${kpis.applyRate.toFixed(1)}%` : "0%",
      change: 0,
      sparklineData: [] as number[],
    },
    {
      title: "Cost per Applicant",
      value: kpis?.costPerApplicant ?? 0,
      change: 0,
      format: "currency" as const,
      sparklineData: [] as number[],
    },
    {
      title: "Time to Hire",
      value: kpis ? `${kpis.timeToHire}d` : "0d",
      change: 0,
      sparklineData: [] as number[],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kpiCards.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}

interface OverviewJobPerformanceTableProps {
  onViewAllJobs: () => void;
  onOpenJob: (jobId: string) => void;
}

export function OverviewJobPerformanceTable({
  onViewAllJobs,
  onOpenJob
}: OverviewJobPerformanceTableProps) {
  const { data: jobs, isLoading } = useJobs();

  const displayRows = useMemo(() => {
    if (!jobs) return [];
    return jobs.map(jobToDisplayRow);
  }, [jobs]);

  if (isLoading) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2>Job Performance</h2>
          <button
            onClick={onViewAllJobs}
            className="inline-flex items-center gap-1 text-xs font-medium text-info transition-colors duration-150 hover:text-info/80"
          >
            <span>View all</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
        <SkeletonDataTable />
      </div>
    );
  }

  if (displayRows.length === 0) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2>Job Performance</h2>
          <button
            onClick={onViewAllJobs}
            className="inline-flex items-center gap-1 text-xs font-medium text-info transition-colors duration-150 hover:text-info/80"
          >
            <span>View all</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="No jobs yet"
          description="Create your first job listing"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2>Job Performance</h2>
        <button
          onClick={onViewAllJobs}
          className="inline-flex items-center gap-1 text-xs font-medium text-info transition-colors duration-150 hover:text-info/80"
        >
          <span>View all</span>
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
      <DataTable
        columns={jobColumns}
        data={displayRows}
        rowKey={(row) => row.id}
        onRowClick={(row) => onOpenJob(row.id)}
      />
    </div>
  );
}

export function OverviewAlertsGrid() {
  const { data: jobs, isLoading } = useJobs();

  const alerts = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    const displayRows = jobs.map(jobToDisplayRow);
    const generated: {
      type: "warning" | "success" | "info";
      title: string;
      description: string;
      action?: { label: string; onClick: () => void };
      aiPowered?: boolean;
    }[] = [];

    const lowHealthJobs = displayRows.filter((j) => j.healthScore < 60);
    if (lowHealthJobs.length > 0) {
      generated.push({
        type: "warning",
        title: "Low health score detected",
        description: `${lowHealthJobs[0].title} has a health score of ${lowHealthJobs[0].healthScore}. Consider updating the job description to improve performance.`,
        action: { label: "Optimize", onClick: () => undefined },
        aiPowered: true,
      });
    }

    const highApplyJobs = displayRows.filter((j) => {
      const rate = parseFloat(j.applyRate);
      return !isNaN(rate) && rate > 4;
    });
    if (highApplyJobs.length > 0) {
      generated.push({
        type: "success",
        title: "Strong apply rate",
        description: `${highApplyJobs[0].title} is performing well with a ${highApplyJobs[0].applyRate} apply rate.`,
      });
    }

    const pausedJobs = displayRows.filter((j) => j.status === "Paused");
    if (pausedJobs.length > 0) {
      generated.push({
        type: "info",
        title: `${pausedJobs.length} paused job${pausedJobs.length > 1 ? "s" : ""}`,
        description: `${pausedJobs.map((j) => j.title).join(", ")} ${pausedJobs.length > 1 ? "are" : "is"} currently paused. Resume to continue receiving applicants.`,
        action: { label: "Review", onClick: () => undefined },
      });
    }

    const unboostedActive = displayRows.filter((j) => j.status === "Active" && !j.boosted);
    if (unboostedActive.length > 0) {
      generated.push({
        type: "info",
        title: "Boost recommended",
        description: `${unboostedActive[0].title} could reach more candidates with a boost.`,
        action: { label: "Start Boost", onClick: () => undefined },
        aiPowered: true,
      });
    }

    return generated;
  }, [jobs]);

  if (isLoading) {
    return (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h2>Alerts & Insights</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-[22px] bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h2>Alerts & Insights</h2>
        </div>
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="No alerts"
          description="Everything looks good. Alerts will appear here when action is needed."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h2>Alerts & Insights</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {alerts.map((alert) => (
          <AlertCard key={alert.title} {...alert} />
        ))}
      </div>
    </div>
  );
}
