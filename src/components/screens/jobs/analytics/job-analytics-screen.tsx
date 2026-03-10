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
import { useJobAnalytics, useJobsComparison } from "@/lib/hooks/use-job-analytics";
import { computeJobFunnel } from "@/lib/hooks/transforms/job-analytics-transforms";
import { JobFunnelCard, type FunnelData } from "./job-funnel-card";
import { JobPerformanceChart } from "./job-performance-chart";
import { JobRecommendationsCard, type Recommendation } from "./job-recommendations-card";
import { JobsComparisonTable } from "./jobs-comparison-table";

interface JobAnalyticsScreenProps {
  readonly jobId: string;
}

// ─── Local helpers ──────────────────────────────────────────────

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

// ─── Screen ─────────────────────────────────────────────────────

export function JobAnalyticsScreen({ jobId }: JobAnalyticsScreenProps) {
  const chart = useChartTheme();
  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const { analytics, isLoading: analyticsLoading } = useJobAnalytics(jobId);
  const { summaries: rawSummaries, benchmarks: rawBenchmarks } = useJobsComparison();

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
        <JobPerformanceChart analytics={[...analytics]} trend="+12% vs prior period" chart={chart} />
      </div>

      {/* Recommendations */}
      <JobRecommendationsCard recommendations={recommendations} jobTitle={title} />

      {/* Comparison table */}
      {rawSummaries.length > 0 ? (
        <JobsComparisonTable
          summaries={rawSummaries.map((s) => ({
            jobId: s.jobId,
            title: s.title,
            status: s.status,
            impressions: s.totalImpressions,
            scrollStopRate: s.scrollStopRate,
            expandRate: s.expandRate,
            applyRate: s.applyRate,
            cpa: s.avgCostPerApplicant,
            healthScore: s.healthScore,
          }))}
          benchmarks={{
            scrollStopRate: rawBenchmarks.avgScrollStopRate,
            expandRate: rawBenchmarks.avgExpandRate,
            applyRate: rawBenchmarks.avgApplyRate,
            cpa: rawBenchmarks.avgCostPerApplicant,
          }}
        />
      ) : null}
    </div>
  );
}
