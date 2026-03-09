"use client";

import { Clock, Crown, TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonChartCard } from "@/components/skeletons/skeleton-chart-card";
import { SkeletonDataTable } from "@/components/skeletons/skeleton-data-table";
import { useMarketInsights } from "@/lib/hooks/use-market-insights";
import type { ChartTheme } from "@/lib/chart-theme";

const talentSupplyIndex = [
  { category: "Design", supply: 72, demand: 88 },
  { category: "Engineering", supply: 65, demand: 95 },
  { category: "Marketing", supply: 84, demand: 76 },
  { category: "Sales", supply: 91, demand: 68 },
  { category: "Data", supply: 58, demand: 92 }
];

const hiringDifficulty = [
  { role: "Senior Engineers", difficulty: 92 },
  { role: "Product Designers", difficulty: 85 },
  { role: "Data Scientists", difficulty: 88 },
  { role: "Marketing Managers", difficulty: 68 },
  { role: "Sales Executives", difficulty: 54 },
  { role: "Customer Success", difficulty: 48 }
];

const bestPostingTimes = [
  { day: "Monday", score: 78 },
  { day: "Tuesday", score: 92 },
  { day: "Wednesday", score: 88 },
  { day: "Thursday", score: 85 },
  { day: "Friday", score: 65 },
  { day: "Saturday", score: 42 },
  { day: "Sunday", score: 38 }
];

export function MarketInsightsHeader() {
  return (
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Market Insights</h1>
        <Badge className="flex items-center gap-1 border-0 bg-warning/10 text-warning">
          <Crown className="h-3 w-3" />
          Pro
        </Badge>
      </div>
      <Button variant="outline">Export Insights</Button>
    </div>
  );
}

export function SalaryBenchmarkCard({ chart }: { chart: ChartTheme }) {
  const { data, isLoading } = useMarketInsights();

  if (isLoading) {
    return <SkeletonChartCard />;
  }

  if (!data || data.salaryData.length === 0) {
    return (
      <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h2 className="mb-4">Salary Benchmarking</h2>
        <div className="flex h-[350px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No salary data available. Add jobs with salary ranges to see benchmarks.
          </p>
        </div>
      </MotionCard>
    );
  }

  const salaryData = data.salaryData;

  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h2 className="mb-4">Salary Benchmarking</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={salaryData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis type="number" stroke={chart.axisStroke} />
          <YAxis dataKey="role" type="category" stroke={chart.axisStroke} width={150} />
          <Tooltip contentStyle={chart.tooltipStyle} />
          <Bar dataKey="market" fill="var(--chart-1)" name="Market Median" radius={[0, 4, 4, 0]} />
          <Bar dataKey="yours" fill="var(--chart-4)" name="Your Offering" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {salaryData.map((item) => {
          const diff = item.yours - item.market;
          const isBelow = diff < 0;
          const percentage = Math.abs((diff / item.market) * 100).toFixed(1);

          return (
            <div key={item.role} className="rounded-xl bg-background p-3">
              <p className="mb-1 truncate text-xs text-muted-foreground">{item.role}</p>
              <div className={`flex items-center gap-1 text-sm ${isBelow ? "text-danger" : "text-success"}`}>
                {isBelow ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                <span>{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </MotionCard>
  );
}

export function SupplyAndDifficultyGrid({ chart }: { chart: ChartTheme }) {
  const { isLoading } = useMarketInsights();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkeletonChartCard />
        <div className="rounded-[22px] border border-border bg-card p-5 shadow-soft">
          <Skeleton className="mb-4 h-5 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h2 className="mb-4">Talent Supply Index</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={talentSupplyIndex}>
            <PolarGrid stroke={chart.gridStroke} />
            <PolarAngleAxis dataKey="category" stroke={chart.axisStroke} />
            <PolarRadiusAxis stroke={chart.axisStroke} />
            <Radar name="Supply" dataKey="supply" stroke="var(--success)" fill="var(--success)" fillOpacity={0.3} />
            <Radar name="Demand" dataKey="demand" stroke="var(--danger)" fill="var(--danger)" fillOpacity={0.3} />
            <Tooltip contentStyle={chart.tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center justify-center gap-6">
          <LegendDot color="bg-success" label="Supply" />
          <LegendDot color="bg-danger" label="Demand" />
        </div>
      </MotionCard>

      <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h2 className="mb-4">Hiring Difficulty Score</h2>
        <div className="space-y-3">
          {hiringDifficulty.map((item) => {
            const { color, label } = getDifficultyAppearance(item.difficulty);

            return (
              <div key={item.role} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.role}</span>
                  <Badge className={`border-0 text-xs text-white ${color}`}>{label}</Badge>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full ${color}`} style={{ width: `${item.difficulty}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </MotionCard>
    </div>
  );
}

export function BestPostingTimeCard({ chart }: { chart: ChartTheme }) {
  const { isLoading } = useMarketInsights();

  if (isLoading) {
    return <SkeletonChartCard />;
  }

  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-info" />
        <h2>Best Posting Times</h2>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={bestPostingTimes}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis dataKey="day" stroke={chart.axisStroke} />
          <YAxis stroke={chart.axisStroke} />
          <Tooltip contentStyle={chart.tooltipStyle} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={{ fill: "var(--chart-1)", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 rounded-lg border border-lynq-accent/15 bg-lynq-accent-muted p-3">
        <div className="mb-0.5 flex items-center gap-2">
          <p className="text-sm font-medium text-lynq-accent">Best time to post: Tuesday, 9-11 AM</p>
          <span className="rounded border border-lynq-accent/20 bg-lynq-accent-muted px-1.5 py-0.5 text-[10px] font-medium text-lynq-accent">
            AI
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Posts on Tuesday mornings receive 23% more engagement on average.
        </p>
      </div>
    </MotionCard>
  );
}

export function RegionalDemandCard() {
  const { data, isLoading } = useMarketInsights();

  if (isLoading) {
    return <SkeletonDataTable rows={6} cols={4} />;
  }

  if (!data || data.regionalDemand.length === 0) {
    return (
      <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <h2 className="mb-4">Regional Demand Trends</h2>
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No regional demand data available. Add candidates with locations to see trends.
          </p>
        </div>
      </MotionCard>
    );
  }

  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h2 className="mb-4">Regional Demand Trends</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Region</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Demand Index</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Avg Salary</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Competition</th>
            </tr>
          </thead>
          <tbody>
            {data.regionalDemand.map((region) => (
              <tr key={region.region} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium">{region.region}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 max-w-[100px] flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-info" style={{ width: `${region.demand}%` }} />
                    </div>
                    <span className="text-sm">{region.demand}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-success">{region.avgSalary}</td>
                <td className="px-4 py-3">
                  <Badge className={`border-0 ${getCompetitionBadgeClass(region.competition)}`}>
                    {region.competition}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotionCard>
  );
}

function getCompetitionBadgeClass(competition: string) {
  if (competition === "Very High") {
    return "bg-danger/10 text-danger";
  }
  if (competition === "High") {
    return "bg-warning/10 text-warning";
  }
  return "bg-info/10 text-info";
}

function getDifficultyAppearance(difficulty: number) {
  if (difficulty >= 80) {
    return { color: "bg-red-500", label: "Very Hard" };
  }
  if (difficulty >= 65) {
    return { color: "bg-amber-500", label: "Hard" };
  }
  if (difficulty >= 50) {
    return { color: "bg-yellow-500", label: "Medium" };
  }
  return { color: "bg-emerald-500", label: "Easy" };
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
