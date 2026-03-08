"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Grid3x3, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  HealthScoreBadge,
  StatusBadge,
  type DataTableColumn
} from "@/components/dashboard/data-table";

interface JobRow {
  id: number;
  title: string;
  status: "Active" | "Paused";
  impressions: string;
  applyRate: string;
  healthScore: number;
  boosted: boolean;
}

const jobsData: JobRow[] = [
  { id: 1, title: "Senior Product Designer", status: "Active", impressions: "124K", applyRate: "4.2%", healthScore: 87, boosted: true },
  { id: 2, title: "Frontend Engineer (React)", status: "Active", impressions: "98K", applyRate: "3.8%", healthScore: 78, boosted: false },
  { id: 3, title: "Marketing Manager", status: "Active", impressions: "156K", applyRate: "5.1%", healthScore: 92, boosted: true },
  { id: 4, title: "Data Analyst", status: "Paused", impressions: "45K", applyRate: "1.8%", healthScore: 52, boosted: false },
  { id: 5, title: "Customer Success Lead", status: "Active", impressions: "73K", applyRate: "3.5%", healthScore: 81, boosted: false },
  { id: 6, title: "DevOps Engineer", status: "Active", impressions: "89K", applyRate: "2.9%", healthScore: 74, boosted: true },
  { id: 7, title: "Content Writer", status: "Active", impressions: "112K", applyRate: "4.8%", healthScore: 85, boosted: false },
  { id: 8, title: "Sales Executive", status: "Paused", impressions: "34K", applyRate: "2.1%", healthScore: 58, boosted: false }
];

export function JobCardsScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const columns: DataTableColumn<JobRow>[] = [
    {
      id: "title",
      header: "Job Title",
      width: "25%",
      cell: (row) => <span className="font-medium">{row.title}</span>
    },
    {
      id: "status",
      header: "Status",
      width: "12%",
      cell: (row) => <StatusBadge status={row.status} />
    },
    { id: "impressions", header: "Impressions", width: "15%", cell: (row) => row.impressions },
    {
      id: "applyRate",
      header: "Apply Rate",
      width: "12%",
      cell: (row) => <span className="font-medium text-success">{row.applyRate}</span>
    },
    {
      id: "healthScore",
      header: "Health Score",
      width: "18%",
      cell: (row) => <HealthScoreBadge score={row.healthScore} />
    },
    {
      id: "boosted",
      header: "Boost",
      width: "18%",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.boosted ? (
            <Badge className="border-0 bg-info/10 text-info">Boosted</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/job-cards/${row.id}/ab-test`);
            }}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            A/B Test
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1">Job Listings</h1>
          <p className="text-sm text-muted-foreground">Manage all your job postings</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-muted" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-muted" : ""}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => router.push("/job-cards/new/edit")}
            className="bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Job
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={jobsData}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/job-cards/${row.id}/edit`)}
      />
    </div>
  );
}
