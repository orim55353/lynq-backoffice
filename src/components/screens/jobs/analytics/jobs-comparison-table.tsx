"use client";

import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { MotionCard } from "@/components/ui/card";
import { HealthScoreBadge, StatusBadge } from "@/components/dashboard/data-table";
import { cn } from "@/lib/utils";

export interface PerformanceSummary {
  readonly jobId: string;
  readonly title: string;
  readonly status: string;
  readonly impressions: number;
  readonly scrollStopRate: number;
  readonly expandRate: number;
  readonly applyRate: number;
  readonly cpa: number;
  readonly healthScore: number;
}

export interface OrgBenchmarks {
  readonly scrollStopRate: number;
  readonly expandRate: number;
  readonly applyRate: number;
  readonly cpa: number;
}

interface JobsComparisonTableProps {
  readonly summaries: readonly PerformanceSummary[];
  readonly benchmarks: OrgBenchmarks;
}

type SortKey = "title" | "impressions" | "scrollStopRate" | "expandRate" | "applyRate" | "cpa" | "healthScore";
type SortDir = "asc" | "desc";

function rateClass(value: number, benchmark: number, inverted = false): string {
  if (inverted) {
    return value <= benchmark ? "text-success" : "text-danger";
  }
  return value >= benchmark ? "text-success" : "text-danger";
}

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (column !== sortKey) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground" />;
  return sortDir === "asc"
    ? <ArrowUp className="ml-1 inline h-3 w-3" />
    : <ArrowDown className="ml-1 inline h-3 w-3" />;
}

const columns: readonly { key: SortKey; label: string; align?: "right" }[] = [
  { key: "title", label: "Title" },
  { key: "impressions", label: "Impressions", align: "right" },
  { key: "scrollStopRate", label: "Scroll Stop %", align: "right" },
  { key: "expandRate", label: "Expand %", align: "right" },
  { key: "applyRate", label: "Apply %", align: "right" },
  { key: "cpa", label: "CPA", align: "right" },
  { key: "healthScore", label: "Health", align: "right" },
];

export function JobsComparisonTable({ summaries, benchmarks }: JobsComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("impressions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...summaries].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    const diff = (aVal as number) - (bVal as number);
    return sortDir === "asc" ? diff : -diff;
  });

  return (
    <MotionCard className="overflow-hidden rounded-[22px] border-border bg-card shadow-soft">
      <div className="p-5 pb-3">
        <h3 className="text-lg font-semibold">Jobs Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border">
              {/* Status column (non-sortable) */}
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    "cursor-pointer select-none px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground",
                    col.align === "right" ? "text-right" : "text-left"
                  )}
                >
                  {col.label}
                  <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr
                key={row.jobId}
                className={cn(
                  "border-b border-border/50 transition-colors duration-150",
                  idx % 2 === 1 ? "bg-muted/25" : ""
                )}
              >
                <td className="px-4 py-3 text-sm">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 text-sm font-medium">{row.title}</td>
                <td className="px-4 py-3 text-right text-sm">{row.impressions.toLocaleString()}</td>
                <td className={cn("px-4 py-3 text-right text-sm font-medium", rateClass(row.scrollStopRate, benchmarks.scrollStopRate))}>
                  {row.scrollStopRate}%
                </td>
                <td className={cn("px-4 py-3 text-right text-sm font-medium", rateClass(row.expandRate, benchmarks.expandRate))}>
                  {row.expandRate}%
                </td>
                <td className={cn("px-4 py-3 text-right text-sm font-medium", rateClass(row.applyRate, benchmarks.applyRate))}>
                  {row.applyRate}%
                </td>
                <td className={cn("px-4 py-3 text-right text-sm font-medium", rateClass(row.cpa, benchmarks.cpa, true))}>
                  ${row.cpa.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <HealthScoreBadge score={row.healthScore} />
                </td>
              </tr>
            ))}

            {/* Benchmark footer row */}
            <tr className="border-t-2 border-border bg-muted/40">
              <td className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground" colSpan={3}>
                Org Benchmark
              </td>
              <td className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                {benchmarks.scrollStopRate}%
              </td>
              <td className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                {benchmarks.expandRate}%
              </td>
              <td className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                {benchmarks.applyRate}%
              </td>
              <td className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                ${benchmarks.cpa.toFixed(2)}
              </td>
              <td className="px-4 py-3" />
            </tr>
          </tbody>
        </table>
      </div>
    </MotionCard>
  );
}
