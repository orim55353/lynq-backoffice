"use client";

import { Trophy, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ChartTheme } from "@/lib/chart-theme";

const versionData = {
  versionA: {
    title: "Senior Product Designer",
    hook: "Shape the future of our product experience.",
    impressions: 45200,
    scrollStopRate: 32.5,
    expandRate: 18.2,
    applyRate: 4.1,
    costPerApplicant: 48
  },
  versionB: {
    title: "Senior Product Designer - Remote First",
    hook: "Design products used by millions. Work from anywhere.",
    impressions: 44800,
    scrollStopRate: 38.7,
    expandRate: 24.3,
    applyRate: 5.8,
    costPerApplicant: 38
  }
};

const metricsComparison = [
  { metric: "Scroll Stop Rate", versionA: 32.5, versionB: 38.7 },
  { metric: "Expand Rate", versionA: 18.2, versionB: 24.3 },
  { metric: "Apply Rate", versionA: 4.1, versionB: 5.8 },
  { metric: "Cost per Applicant", versionA: 48, versionB: 38 }
];

interface AbTestingHeaderProps {
  onBack: () => void;
}

export function AbTestingHeader({ onBack }: AbTestingHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
      <div>
        <h1 className="mb-1">A/B Testing</h1>
        <p className="text-sm text-muted-foreground">Compare job card performance</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onBack}>
          Back to Jobs
        </Button>
        <Button>Create New Test</Button>
      </div>
    </div>
  );
}

export function ActiveTestCard() {
  return (
    <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-lg font-semibold">Active Test: Senior Product Designer</h3>
          <p className="text-sm text-muted-foreground">Running for 14 days - 90,000 total impressions</p>
        </div>
        <Badge className="border-0 bg-success/10 text-success">Active</Badge>
      </div>
    </Card>
  );
}

export function VersionComparisonGrid() {
  const versionBImpressionDelta =
    ((versionData.versionB.impressions - versionData.versionA.impressions) /
      versionData.versionA.impressions) *
    100;
  const versionBScrollStopDelta =
    ((versionData.versionB.scrollStopRate - versionData.versionA.scrollStopRate) /
      versionData.versionA.scrollStopRate) *
    100;
  const versionBExpandDelta =
    ((versionData.versionB.expandRate - versionData.versionA.expandRate) / versionData.versionA.expandRate) * 100;
  const versionBApplyDelta =
    ((versionData.versionB.applyRate - versionData.versionA.applyRate) / versionData.versionA.applyRate) * 100;
  const versionBCpaDelta =
    ((versionData.versionB.costPerApplicant - versionData.versionA.costPerApplicant) /
      versionData.versionA.costPerApplicant) *
    100;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card className="overflow-hidden rounded-[10px] border-border bg-card shadow-soft">
        <div className="border-b border-border p-6">
          <h3 className="mb-4 text-lg font-semibold">Version A (Control)</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{versionData.versionA.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hook</p>
              <p className="font-medium">{versionData.versionA.hook}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <MetricRow label="Impressions" value={versionData.versionA.impressions.toLocaleString()} />
          <MetricRow label="Scroll Stop Rate" value={`${versionData.versionA.scrollStopRate}%`} />
          <MetricRow label="Expand Rate" value={`${versionData.versionA.expandRate}%`} />
          <MetricRow label="Apply Rate" value={`${versionData.versionA.applyRate}%`} />
          <MetricRow label="Cost per Applicant" value={`$${versionData.versionA.costPerApplicant}`} />
        </div>
      </Card>

      <Card className="overflow-hidden rounded-[10px] border border-success/20 bg-card shadow-soft">
        <div className="border-b border-border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Version B (Variant)</h3>
            <Badge className="flex items-center gap-1 border-0 bg-success text-white">
              <Trophy className="h-3 w-3" />
              Winner
            </Badge>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{versionData.versionB.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hook</p>
              <p className="font-medium">{versionData.versionB.hook}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <MetricRow
            label="Impressions"
            value={versionData.versionB.impressions.toLocaleString()}
            change={versionBImpressionDelta}
          />
          <MetricRow
            label="Scroll Stop Rate"
            value={`${versionData.versionB.scrollStopRate}%`}
            change={versionBScrollStopDelta}
          />
          <MetricRow label="Expand Rate" value={`${versionData.versionB.expandRate}%`} change={versionBExpandDelta} />
          <MetricRow label="Apply Rate" value={`${versionData.versionB.applyRate}%`} change={versionBApplyDelta} />
          <MetricRow
            label="Cost per Applicant"
            value={`$${versionData.versionB.costPerApplicant}`}
            change={versionBCpaDelta}
            inverted
          />
        </div>
      </Card>
    </div>
  );
}

export function PerformanceComparisonChart({ chart }: { chart: ChartTheme }) {
  return (
    <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
      <h3 className="mb-4 text-lg font-semibold">Performance Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={metricsComparison}>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis dataKey="metric" stroke={chart.axisStroke} />
          <YAxis stroke={chart.axisStroke} />
          <Tooltip contentStyle={chart.tooltipStyle} />
          <Bar dataKey="versionA" fill="var(--chart-1)" name="Version A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="versionB" fill="var(--success)" name="Version B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function TestRecommendationCard() {
  return (
    <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="mb-1 font-semibold">Version B is performing 41% better</h3>
          <p className="text-sm text-muted-foreground">
            Based on 90,000 impressions, Version B shows statistically significant improvements.
          </p>
        </div>
        <Button className="bg-success text-white hover:bg-success/90">Apply Version B to All Jobs</Button>
      </div>
    </Card>
  );
}

function MetricRow({
  label,
  value,
  change,
  inverted = false
}: {
  label: string;
  value: string;
  change?: number;
  inverted?: boolean;
}) {
  const hasChange = typeof change === "number";
  const isPositive = hasChange ? (inverted ? change < 0 : change > 0) : false;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{value}</span>
        {hasChange ? (
          <div className={`flex items-center gap-1 text-xs ${isPositive ? "text-success" : "text-danger"}`}>
            <TrendingUp className={`h-3 w-3 ${!isPositive ? "rotate-180" : ""}`} />
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
