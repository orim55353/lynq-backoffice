"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { MotionCard } from "@/components/ui/card";
import type { ChartTheme } from "@/lib/chart-theme";
import { useAnalyticsSummary } from "@/lib/hooks/use-analytics";
import { SkeletonChartCard } from "@/components/skeletons/skeleton-chart-card";

export function ConversionFunnelCard() {
  const { data, isLoading } = useAnalyticsSummary();

  if (isLoading || !data) {
    return <SkeletonChartCard />;
  }

  const { funnelData } = data;

  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h2 className="mb-5">Conversion Funnel</h2>
      <div className="space-y-2">
        {funnelData.map((item, index) => {
          const isLast = index === funnelData.length - 1;
          const widthPercent = (item.value / funnelData[0].value) * 100;
          const width = Math.max(widthPercent, 15);

          return (
            <div key={item.stage}>
              <div
                className="relative flex min-w-fit items-center rounded-lg border border-info/20 bg-info/10 px-4 py-3 transition-all duration-150 hover:scale-[1.01]"
                style={{
                  width: `${width}%`,
                  marginLeft: `${(100 - width) / 2}%`,
                  opacity: 1 - index * 0.08
                }}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-sm font-medium">{item.stage}</p>
                    <p className="whitespace-nowrap text-xs text-muted-foreground">
                      {item.value.toLocaleString()} - {item.conversion}%
                    </p>
                  </div>
                  {!isLast && item.dropoff > 0 ? (
                    <Badge className="shrink-0 whitespace-nowrap border-0 bg-danger/10 text-xs text-danger">
                      -{item.dropoff}%
                    </Badge>
                  ) : null}
                </div>
              </div>
              {!isLast ? (
                <div className="flex justify-center py-0.5">
                  <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </MotionCard>
  );
}

export function TrafficAndApplyTrend({ chart }: { chart: ChartTheme }) {
  const { data, isLoading } = useAnalyticsSummary();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SkeletonChartCard />
        <SkeletonChartCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h3 className="mb-4">Impressions Over Time</h3>
        <ResponsiveContainer width="100%" height={280} minWidth={0}>
          <AreaChart data={data.impressionsOverTime}>
            <defs>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
            <XAxis dataKey="date" stroke={chart.axisStroke} tick={{ fontSize: 12 }} />
            <YAxis stroke={chart.axisStroke} tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={chart.tooltipStyle} />
            <Area
              type="monotone"
              dataKey="impressions"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorImpressions)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </MotionCard>

      <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h3 className="mb-4">Apply Rate Trend</h3>
        <ResponsiveContainer width="100%" height={280} minWidth={0}>
          <LineChart data={data.applyRateTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
            <XAxis dataKey="week" stroke={chart.axisStroke} tick={{ fontSize: 12 }} />
            <YAxis stroke={chart.axisStroke} tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={chart.tooltipStyle} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="var(--success)"
              strokeWidth={2}
              dot={{ fill: "var(--success)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 rounded-lg border border-success/20 bg-success/5 p-3">
          <div className="flex items-center gap-2 text-success">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">+14% vs last period</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Your apply rate is trending up consistently</p>
        </div>
      </MotionCard>
    </div>
  );
}

export function DwellTimeAndSourceBreakdown({ chart }: { chart: ChartTheme }) {
  const { data, isLoading } = useAnalyticsSummary();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SkeletonChartCard />
        <SkeletonChartCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h3 className="mb-4">Avg Dwell Time by Job</h3>
        <ResponsiveContainer width="100%" height={280} minWidth={0}>
          <BarChart data={data.dwellTimeByJob} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
            <XAxis type="number" stroke={chart.axisStroke} tick={{ fontSize: 12 }} />
            <YAxis dataKey="job" type="category" stroke={chart.axisStroke} width={130} tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={chart.tooltipStyle} />
            <Bar dataKey="dwellTime" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </MotionCard>

      <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h3 className="mb-4">Application Source Distribution</h3>
        <div className="space-y-3">
          {data.sourceDistribution.map((source) => (
            <div key={source.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{source.name}</span>
                <span className="font-medium">{source.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full" style={{ width: `${source.value}%`, backgroundColor: source.color }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{source.count.toLocaleString()} applications</p>
            </div>
          ))}
        </div>
      </MotionCard>
    </div>
  );
}

export function BenchmarkSummary() {
  const { data, isLoading } = useAnalyticsSummary();

  if (isLoading || !data) {
    return <SkeletonChartCard />;
  }

  const { benchmarks } = data;

  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h2 className="mb-5">Performance vs Category Benchmarks</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <BenchmarkCard
          title="Apply Rate"
          yourValue={benchmarks.applyRate}
          categoryAvg={benchmarks.applyRateAvg}
          format="percentage"
        />
        <BenchmarkCard
          title="Avg Dwell Time"
          yourValue={benchmarks.avgDwellTime}
          categoryAvg={benchmarks.avgDwellTimeAvg}
          format="seconds"
        />
        <BenchmarkCard
          title="Cost per Applicant"
          yourValue={benchmarks.costPerApplicant}
          categoryAvg={benchmarks.costPerApplicantAvg}
          format="currency"
          inverted
        />
      </div>
    </MotionCard>
  );
}

function BenchmarkCard({
  title,
  yourValue,
  categoryAvg,
  format,
  inverted = false
}: {
  title: string;
  yourValue: number;
  categoryAvg: number;
  format: "percentage" | "seconds" | "currency";
  inverted?: boolean;
}) {
  const difference = categoryAvg === 0 ? 0 : ((yourValue - categoryAvg) / categoryAvg) * 100;
  const isPositive = inverted ? difference < 0 : difference > 0;
  const index = categoryAvg === 0 ? 0 : Math.round((yourValue / categoryAvg) * 100);

  const formatValue = (value: number) => {
    if (format === "percentage") {
      return `${value}%`;
    }
    if (format === "seconds") {
      return `${value}s`;
    }
    return `$${value}`;
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="mb-3 text-xs text-muted-foreground">{title}</p>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">You</span>
            <span className="text-sm font-semibold">{formatValue(yourValue)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${isPositive ? "bg-success" : "bg-danger"}`}
              style={{ width: `${Math.max(yourValue, categoryAvg) === 0 ? 0 : (yourValue / Math.max(yourValue, categoryAvg)) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Category Avg</span>
            <span className="text-xs text-muted-foreground">{formatValue(categoryAvg)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-muted-foreground/30"
              style={{ width: `${Math.max(yourValue, categoryAvg) === 0 ? 0 : (categoryAvg / Math.max(yourValue, categoryAvg)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className={`mt-3 text-center text-xs font-medium ${isPositive ? "text-success" : "text-danger"}`}>
        Index: {index}
        <span className="ml-1 text-muted-foreground">(avg = 100)</span>
      </div>
    </div>
  );
}
