"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MotionCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChartTheme } from "@/lib/chart-theme";

export interface AnalyticsDay {
  readonly date: string;
  readonly impressions: number;
  readonly scrollStops: number;
  readonly expands: number;
  readonly applies: number;
}

interface JobPerformanceChartProps {
  readonly analytics: readonly AnalyticsDay[];
  readonly trend: string;
  readonly chart: ChartTheme;
}

type Metric = "impressions" | "scrollStops" | "expands" | "applies";

const metrics: readonly { key: Metric; label: string; color: string }[] = [
  { key: "impressions", label: "Impressions", color: "var(--chart-1)" },
  { key: "scrollStops", label: "Scroll Stops", color: "var(--chart-2, #8b5cf6)" },
  { key: "expands", label: "Expands", color: "var(--chart-3, #f59e0b)" },
  { key: "applies", label: "Applies", color: "var(--success)" },
];

const ranges = ["7d", "30d", "90d"] as const;
type Range = (typeof ranges)[number];

function filterByRange(data: readonly AnalyticsDay[], range: Range): readonly AnalyticsDay[] {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return data.slice(-days);
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend.startsWith("+")) {
    return <TrendingUp className="h-4 w-4 text-success" />;
  }
  if (trend.startsWith("-")) {
    return <TrendingDown className="h-4 w-4 text-danger" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function trendColor(trend: string): string {
  if (trend.startsWith("+")) return "text-success";
  if (trend.startsWith("-")) return "text-danger";
  return "text-muted-foreground";
}

export function JobPerformanceChart({ analytics, trend, chart }: JobPerformanceChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<readonly Metric[]>(["impressions"]);
  const [range, setRange] = useState<Range>("30d");

  const filteredData = filterByRange(analytics, range);

  const toggleMetric = (metric: Metric) => {
    setActiveMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Performance</h3>
          <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor(trend))}>
            <TrendIcon trend={trend} />
            <span>{trend}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                range === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {metrics.map((m) => (
          <button
            key={m.key}
            onClick={() => toggleMetric(m.key)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeMetrics.includes(m.key)
                ? "border-transparent bg-foreground/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
            {m.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={280} minWidth={0}>
        <LineChart data={filteredData as AnalyticsDay[]}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis dataKey="date" stroke={chart.axisStroke} tick={{ fontSize: 12 }} />
          <YAxis stroke={chart.axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={chart.tooltipStyle} />
          {metrics
            .filter((m) => activeMetrics.includes(m.key))
            .map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                stroke={m.color}
                strokeWidth={2}
                dot={{ fill: m.color, r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </MotionCard>
  );
}
