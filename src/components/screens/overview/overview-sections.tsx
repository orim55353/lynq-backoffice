"use client";

import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertCard } from "@/components/dashboard/alert-card";
import { DataTable, HealthScoreBadge, StatusBadge, type DataTableColumn } from "@/components/dashboard/data-table";
import { KpiCard } from "@/components/dashboard/kpi-card";

const kpiData = [
  {
    title: "Active Jobs",
    value: 12,
    change: 8,
    sparklineData: [8, 9, 11, 10, 12, 11, 12]
  },
  {
    title: "Total Impressions",
    value: "847K",
    change: 15.3,
    sparklineData: [620, 680, 720, 780, 810, 830, 847]
  },
  {
    title: "Avg Dwell Time",
    value: "24.5s",
    change: 12.8,
    sparklineData: [18, 19, 21, 22, 23, 24, 24.5]
  },
  {
    title: "Apply Rate",
    value: "3.2%",
    change: 5.2,
    sparklineData: [2.8, 2.9, 3, 3.1, 3.1, 3.2, 3.2]
  },
  {
    title: "Cost per Applicant",
    value: 45,
    change: -8.5,
    format: "currency" as const,
    sparklineData: [52, 50, 49, 47, 46, 45, 45]
  },
  {
    title: "Time to Hire",
    value: 14,
    change: -12,
    format: "time" as const,
    sparklineData: [18, 17, 16, 15, 15, 14, 14]
  }
];

interface JobRow {
  id: number;
  title: string;
  status: "Active" | "Paused";
  impressions: string;
  dwellTime: string;
  applyRate: string;
  healthScore: number;
  boosted: boolean;
}

const jobsData: JobRow[] = [
  {
    id: 1,
    title: "Senior Product Designer",
    status: "Active",
    impressions: "124K",
    dwellTime: "28.5s",
    applyRate: "4.2%",
    healthScore: 87,
    boosted: true
  },
  {
    id: 2,
    title: "Frontend Engineer (React)",
    status: "Active",
    impressions: "98K",
    dwellTime: "22.1s",
    applyRate: "3.8%",
    healthScore: 78,
    boosted: false
  },
  {
    id: 3,
    title: "Marketing Manager",
    status: "Active",
    impressions: "156K",
    dwellTime: "31.2s",
    applyRate: "5.1%",
    healthScore: 92,
    boosted: true
  },
  {
    id: 4,
    title: "Data Analyst",
    status: "Paused",
    impressions: "45K",
    dwellTime: "15.3s",
    applyRate: "1.8%",
    healthScore: 52,
    boosted: false
  },
  {
    id: 5,
    title: "Customer Success Lead",
    status: "Active",
    impressions: "73K",
    dwellTime: "26.8s",
    applyRate: "3.5%",
    healthScore: 81,
    boosted: false
  }
];

const alerts = [
  {
    type: "warning" as const,
    title: "Apply rate below category average",
    description:
      "Your Data Analyst position is underperforming. Consider updating the job description.",
    action: { label: "Optimize", onClick: () => undefined },
    aiPowered: true
  },
  {
    type: "success" as const,
    title: "High intent candidates waiting",
    description: "3 qualified candidates viewed your Senior Product Designer role multiple times.",
    action: { label: "Review", onClick: () => undefined }
  },
  {
    type: "info" as const,
    title: "Boost recommended",
    description:
      "Your Frontend Engineer position could reach 30% more candidates with a boost.",
    action: { label: "Start Boost", onClick: () => undefined },
    aiPowered: true
  },
  {
    type: "warning" as const,
    title: "Salary below market median",
    description: "Marketing Manager salary is 12% below market. This may impact apply rate.",
    action: { label: "Adjust", onClick: () => undefined },
    aiPowered: true
  }
];

const jobColumns: DataTableColumn<JobRow>[] = [
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
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kpiData.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}

interface OverviewJobPerformanceTableProps {
  onViewAllJobs: () => void;
  onOpenJob: (jobId: number) => void;
}

export function OverviewJobPerformanceTable({
  onViewAllJobs,
  onOpenJob
}: OverviewJobPerformanceTableProps) {
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
        data={jobsData}
        rowKey={(row) => row.id}
        onRowClick={(row) => onOpenJob(row.id)}
      />
    </div>
  );
}

export function OverviewAlertsGrid() {
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
