"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/ui/card";
import { SkeletonChartCard } from "@/components/skeletons/skeleton-chart-card";
import { StatusBadge, HealthScoreBadge } from "@/components/dashboard/data-table";
import { useChartTheme } from "@/lib/chart-theme";
import { useJob } from "@/lib/hooks/use-jobs";
import { MOCK_ANALYTICS } from "@/lib/data/mock-analytics";
import { JobFunnelCard, type FunnelData } from "./job-funnel-card";
import { JobPerformanceChart, type AnalyticsDay } from "./job-performance-chart";
import { JobRecommendationsCard, type Recommendation } from "./job-recommendations-card";
import {
  JobsComparisonTable,
  type PerformanceSummary,
  type OrgBenchmarks,
} from "./jobs-comparison-table";

interface JobAnalyticsScreenProps {
  readonly jobId: string;
}

// ─── Placeholder hooks (replace with real Firestore hooks) ──────

function useJobAnalytics(jobId: string) {
  const analytics = useMemo<readonly AnalyticsDay[]>(() => {
    const mockData = MOCK_ANALYTICS[jobId];
    if (!mockData) return [];
    return mockData.map((d) => ({
      date: d.date,
      impressions: d.impressions,
      scrollStops: d.scrollStops,
      expands: d.expands,
      applies: d.applies,
    }));
  }, [jobId]);

  return { data: analytics, isLoading: false };
}

function computeJobFunnel(analytics: readonly AnalyticsDay[]): FunnelData {
  const totals = analytics.reduce(
    (acc, d) => ({
      impressions: acc.impressions + d.impressions,
      scrollStops: acc.scrollStops + d.scrollStops,
      expands: acc.expands + d.expands,
      applies: acc.applies + d.applies,
    }),
    { impressions: 0, scrollStops: 0, expands: 0, applies: 0 }
  );
  const imp = totals.impressions || 1;
  return {
    ...totals,
    scrollStopRate: Math.round((totals.scrollStops / imp) * 1000) / 10,
    expandRate: Math.round((totals.expands / imp) * 1000) / 10,
    applyRate: Math.round((totals.applies / imp) * 1000) / 10,
  };
}

function computeRecommendations(funnel: FunnelData): readonly Recommendation[] {
  const recs: Recommendation[] = [];
  if (funnel.scrollStopRate < 10) {
    recs.push({ id: "low-scroll", severity: "high", icon: "trending-down", message: "Low scroll-stop rate. Consider improving your job card hook.", action: "Edit Hook", actionRoute: undefined });
  }
  if (funnel.applyRate < 2) {
    recs.push({ id: "low-apply", severity: "medium", icon: "users", message: "Apply rate is below average. Review your requirements section.", action: "Review", actionRoute: undefined });
  }
  return recs;
}

function useJobsComparison(): { data: { summaries: PerformanceSummary[]; benchmarks: OrgBenchmarks } | null; isLoading: boolean } {
  return { data: null, isLoading: false };
}

// ─── Screen ─────────────────────────────────────────────────────

export function JobAnalyticsScreen({ jobId }: JobAnalyticsScreenProps) {
  const chart = useChartTheme();
  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const { data: analytics, isLoading: analyticsLoading } = useJobAnalytics(jobId);
  const comparison = useJobsComparison();

  const funnel = useMemo(() => computeJobFunnel(analytics), [analytics]);
  const recommendations = useMemo(() => computeRecommendations(funnel), [funnel]);

  const isLoading = jobLoading || analyticsLoading;
  const title = job?.title ?? "Job";
  const status = job?.status ?? "Draft";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonChartCard />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><SkeletonChartCard /><SkeletonChartCard /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{title}</h1>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/jobs/${jobId}/ab-test`}>
            <Button variant="outline" size="sm"><FlaskConical className="mr-1.5 h-4 w-4" />A/B Test</Button>
          </Link>
          <Link href={`/jobs/${jobId}/edit`}>
            <Button variant="outline" size="sm"><Pencil className="mr-1.5 h-4 w-4" />Edit Job</Button>
          </Link>
          <Link href="/jobs">
            <Button variant="outline" size="sm"><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Button>
          </Link>
        </div>
      </div>

      {/* Health banner */}
      <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Health Score</p>
            <div className="mt-1"><HealthScoreBadge score={job?.qualityScore ?? 0} /></div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Impressions</p>
            <p className="mt-1 text-lg font-semibold">{funnel.impressions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Apply Rate</p>
            <p className="mt-1 text-lg font-semibold">{funnel.applyRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">CPA</p>
            <p className="mt-1 text-lg font-semibold">${funnel.applies > 0 ? (funnel.applies * 45).toFixed(2) : "—"}</p>
          </div>
        </div>
      </MotionCard>

      {/* Funnel + Performance chart */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <JobFunnelCard funnel={funnel} jobTitle={title} />
        <JobPerformanceChart analytics={analytics as AnalyticsDay[]} trend="+12% vs prior period" chart={chart} />
      </div>

      {/* Recommendations */}
      <JobRecommendationsCard recommendations={recommendations} jobTitle={title} />

      {/* Comparison table */}
      {comparison.data ? (
        <JobsComparisonTable summaries={comparison.data.summaries} benchmarks={comparison.data.benchmarks} />
      ) : null}
    </div>
  );
}
