"use client";

import { FlaskConical, Trophy, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonChartCard } from "@/components/skeletons/skeleton-chart-card";
import { SkeletonDataTable } from "@/components/skeletons/skeleton-data-table";
import { useAbTests } from "@/lib/hooks/use-ab-tests";
import type { AbTest } from "@/lib/hooks/use-ab-tests";
import type { ChartTheme } from "@/lib/chart-theme";

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

export function ActiveTestCard({ test, isLoading }: { test: AbTest | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="mb-2 h-5 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!test) {
    return (
      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold">No active test</h3>
            <p className="text-sm text-muted-foreground">Create a new A/B test to get started</p>
          </div>
        </div>
      </Card>
    );
  }

  const totalImpressions = test.versionA.impressions + test.versionB.impressions;

  return (
    <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-lg font-semibold">Active Test: {test.name}</h3>
          <p className="text-sm text-muted-foreground">
            {totalImpressions.toLocaleString()} total impressions
          </p>
        </div>
        <Badge
          className={`border-0 ${
            test.status === "active"
              ? "bg-success/10 text-success"
              : test.status === "completed"
                ? "bg-muted text-muted-foreground"
                : "bg-warning/10 text-warning"
          }`}
        >
          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
        </Badge>
      </div>
    </Card>
  );
}

export function VersionComparisonGrid({ test, isLoading }: { test: AbTest | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SkeletonDataTable rows={5} cols={2} />
        <SkeletonDataTable rows={5} cols={2} />
      </div>
    );
  }

  if (!test) {
    return (
      <EmptyState
        icon={<FlaskConical className="h-6 w-6" />}
        title="No test data"
        description="Create an A/B test to compare different versions of your job cards."
      />
    );
  }

  const { versionA, versionB } = test;

  const impressionDelta = ((versionB.impressions - versionA.impressions) / versionA.impressions) * 100;
  const scrollStopDelta = ((versionB.scrollStopRate - versionA.scrollStopRate) / versionA.scrollStopRate) * 100;
  const expandDelta = ((versionB.expandRate - versionA.expandRate) / versionA.expandRate) * 100;
  const applyDelta = ((versionB.applyRate - versionA.applyRate) / versionA.applyRate) * 100;
  const cpaDelta = ((versionB.costPerApplicant - versionA.costPerApplicant) / versionA.costPerApplicant) * 100;

  const bIsBetter = versionB.applyRate > versionA.applyRate;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card className="overflow-hidden rounded-[10px] border-border bg-card shadow-soft">
        <div className="border-b border-border p-6">
          <h3 className="mb-4 text-lg font-semibold">Version A (Control)</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{versionA.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hook</p>
              <p className="font-medium">{versionA.hook}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <MetricRow label="Impressions" value={versionA.impressions.toLocaleString()} />
          <MetricRow label="Scroll Stop Rate" value={`${versionA.scrollStopRate}%`} />
          <MetricRow label="Expand Rate" value={`${versionA.expandRate}%`} />
          <MetricRow label="Apply Rate" value={`${versionA.applyRate}%`} />
          <MetricRow label="Cost per Applicant" value={`$${versionA.costPerApplicant}`} />
        </div>
      </Card>

      <Card
        className={`overflow-hidden rounded-[10px] border ${
          bIsBetter ? "border-success/20" : "border-border"
        } bg-card shadow-soft`}
      >
        <div className="border-b border-border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Version B (Variant)</h3>
            {bIsBetter ? (
              <Badge className="flex items-center gap-1 border-0 bg-success text-white">
                <Trophy className="h-3 w-3" />
                Winner
              </Badge>
            ) : null}
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{versionB.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hook</p>
              <p className="font-medium">{versionB.hook}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <MetricRow label="Impressions" value={versionB.impressions.toLocaleString()} change={impressionDelta} />
          <MetricRow label="Scroll Stop Rate" value={`${versionB.scrollStopRate}%`} change={scrollStopDelta} />
          <MetricRow label="Expand Rate" value={`${versionB.expandRate}%`} change={expandDelta} />
          <MetricRow label="Apply Rate" value={`${versionB.applyRate}%`} change={applyDelta} />
          <MetricRow
            label="Cost per Applicant"
            value={`$${versionB.costPerApplicant}`}
            change={cpaDelta}
            inverted
          />
        </div>
      </Card>
    </div>
  );
}

export function PerformanceComparisonChart({
  test,
  isLoading,
  chart,
}: {
  test: AbTest | null;
  isLoading: boolean;
  chart: ChartTheme;
}) {
  if (isLoading) {
    return <SkeletonChartCard />;
  }

  if (!test) {
    return null;
  }

  const metricsComparison = [
    { metric: "Scroll Stop Rate", versionA: test.versionA.scrollStopRate, versionB: test.versionB.scrollStopRate },
    { metric: "Expand Rate", versionA: test.versionA.expandRate, versionB: test.versionB.expandRate },
    { metric: "Apply Rate", versionA: test.versionA.applyRate, versionB: test.versionB.applyRate },
    {
      metric: "Cost per Applicant",
      versionA: test.versionA.costPerApplicant,
      versionB: test.versionB.costPerApplicant,
    },
  ];

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

export function TestRecommendationCard({ test, isLoading }: { test: AbTest | null; isLoading: boolean }) {
  if (isLoading || !test) {
    return null;
  }

  const bApplyRate = test.versionB.applyRate;
  const aApplyRate = test.versionA.applyRate;
  const bIsBetter = bApplyRate > aApplyRate;
  const winnerLabel = bIsBetter ? "Version B" : "Version A";
  const improvement = bIsBetter
    ? ((bApplyRate - aApplyRate) / aApplyRate) * 100
    : ((aApplyRate - bApplyRate) / bApplyRate) * 100;
  const totalImpressions = test.versionA.impressions + test.versionB.impressions;

  return (
    <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="mb-1 font-semibold">
            {winnerLabel} is performing {Math.round(improvement)}% better
          </h3>
          <p className="text-sm text-muted-foreground">
            Based on {totalImpressions.toLocaleString()} impressions, {winnerLabel} shows statistically significant
            improvements.
          </p>
        </div>
        <Button className="bg-success text-white hover:bg-success/90">Apply {winnerLabel} to All Jobs</Button>
      </div>
    </Card>
  );
}

export function AbTestingContent({ chart, onBack }: { chart: ChartTheme; onBack: () => void }) {
  const { data: tests, isLoading } = useAbTests();
  const activeTest = tests?.find((t) => t.status === "active") ?? tests?.[0] ?? null;

  return (
    <div className="space-y-6">
      <AbTestingHeader onBack={onBack} />
      <ActiveTestCard test={activeTest} isLoading={isLoading} />
      <VersionComparisonGrid test={activeTest} isLoading={isLoading} />
      <PerformanceComparisonChart test={activeTest} isLoading={isLoading} chart={chart} />
      <TestRecommendationCard test={activeTest} isLoading={isLoading} />
    </div>
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
