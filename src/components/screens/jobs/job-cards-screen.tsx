"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, Briefcase, Grid3x3, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DataTable,
  HealthScoreBadge,
  StatusBadge,
  type DataTableColumn
} from "@/components/dashboard/data-table";
import { useJobs } from "@/lib/hooks/use-jobs";
import { jobToDisplayRow } from "@/lib/hooks/transforms";
import type { JobDisplayRow } from "@/lib/hooks/types";
import { SkeletonDataTable } from "@/components/skeletons/skeleton-data-table";
import { EmptyState } from "@/components/ui/empty-state";
import {
  layoutSpring,
  listItemTransition,
  useLiftMotion,
  useTapMotion
} from "@/components/ui/motion";

const viewOptions = [
  { id: "list" as const, label: "List", icon: List },
  { id: "grid" as const, label: "Grid", icon: Grid3x3 }
];

export function JobCardsScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { data, isLoading } = useJobs();
  const hoverLift = useLiftMotion();
  const tapMotion = useTapMotion();

  const rows = useMemo(() => (data ?? []).map(jobToDisplayRow), [data]);

  const columns: DataTableColumn<JobDisplayRow>[] = [
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
              router.push(`/jobs/${row.id}/ab-test`);
            }}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            A/B Test
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/jobs/${row.id}/analytics`);
            }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <BarChart3 className="h-3 w-3" />
            Analytics
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={listItemTransition}
            className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/70 p-1.5 shadow-sm backdrop-blur"
          >
            {viewOptions.map((option) => {
              const active = option.id === viewMode;
              const Icon = option.icon;

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setViewMode(option.id)}
                  whileHover={active ? undefined : hoverLift}
                  whileTap={tapMotion}
                  transition={layoutSpring}
                  className={`relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${active ? "text-lynq-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="job-view-mode-pill"
                      className="absolute inset-0 rounded-full bg-lynq-accent shadow-sm"
                      transition={layoutSpring}
                    />
                  ) : null}
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <Button
            onClick={() => router.push("/jobs/new/edit")}
            className="bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Job
          </Button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonDataTable rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="No job listings yet"
          description="Create your first job listing"
          action={{
            label: "Create New Job",
            onClick: () => router.push("/jobs/new/edit"),
          }}
        />
      ) : viewMode === "list" ? (
        <DataTable
          columns={columns}
          data={rows}
          rowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/jobs/${row.id}/edit`)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <Card
              key={row.id}
              className="cursor-pointer rounded-[22px] border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-md"
              onClick={() => router.push(`/jobs/${row.id}/edit`)}
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold leading-snug">{row.title}</h3>
                <StatusBadge status={row.status} />
              </div>

              <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Impressions</span>
                  <span className="font-medium text-foreground">{row.impressions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Apply Rate</span>
                  <span className="font-medium text-success">{row.applyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Score</span>
                  <HealthScoreBadge score={row.healthScore} />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                {row.boosted ? (
                  <Badge className="border-0 bg-info/10 text-info">Boosted</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Not boosted</span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/jobs/${row.id}/ab-test`);
                    }}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    A/B Test
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/jobs/${row.id}/analytics`);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <BarChart3 className="h-3 w-3" />
                    Analytics
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
