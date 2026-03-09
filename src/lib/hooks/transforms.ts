import type { Job, Application, Candidate as FirestoreCandidate, AnalyticsEvent } from "@/lib/firebase/types";
import type { JobDisplayRow, CandidateDisplayInfo, OverviewKpis, AnalyticsSummary } from "./types";

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${Math.round(num / 1000)}K`;
  return num.toString();
}

function formatTimestamp(ts: { toDate?: () => Date } | null): string {
  if (!ts || !ts.toDate) return "";
  const date = ts.toDate();
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export function jobToDisplayRow(job: Job): JobDisplayRow {
  return {
    id: job.id,
    title: job.title,
    status: job.status === "active" ? "Active" : "Paused",
    impressions: formatNumber(job.viewCount),
    dwellTime: "—",
    applyRate: job.viewCount > 0 ? `${((job.applicationCount / job.viewCount) * 100).toFixed(1)}%` : "0%",
    healthScore: Math.min(100, Math.round(
      (job.viewCount > 0 ? (job.applicationCount / job.viewCount) * 100 : 0) * 20 +
      Math.min(job.viewCount / 1000, 50) + 10
    )),
    boosted: false,
  };
}

export function candidateWithApplication(
  candidate: FirestoreCandidate,
  application: Application | undefined,
  job: Job | undefined
): CandidateDisplayInfo {
  const stageMap: Record<string, CandidateDisplayInfo["stage"]> = {
    applied: "Applied",
    reviewed: "Reviewed",
    interview: "Interview",
    offer: "Offer",
    hired: "Hired",
    rejected: "Rejected",
  };

  const engagementMap: Record<string, CandidateDisplayInfo["engagement"]> = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return {
    id: candidate.id,
    name: candidate.name,
    role: candidate.currentRole,
    jobId: application?.jobId ?? "",
    jobTitle: job?.title ?? "",
    location: candidate.location,
    email: candidate.email,
    phone: candidate.phone,
    linkedin: candidate.linkedinURL,
    fitScore: application?.fitScore ?? 0,
    intentScore: application?.intentScore ?? 0,
    engagement: engagementMap[application?.engagement ?? "medium"] ?? "Medium",
    stage: stageMap[application?.stage ?? "applied"] ?? "Applied",
    appliedDate: application ? formatTimestamp(application.appliedAt) : "",
    lastActivity: application?.lastActivity ?? "",
    avatar: candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    experience: `${candidate.experienceYears} years`,
    availability: candidate.availability,
    currentCompany: candidate.currentCompany,
    skills: candidate.skills,
    note: application?.notes ?? "",
  };
}

export function computeOverviewKpis(
  jobs: Job[],
  applications: Application[],
): OverviewKpis {
  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const totalImpressions = jobs.reduce((sum, j) => sum + j.viewCount, 0);
  const totalApplications = applications.length;
  const applyRate = totalImpressions > 0 ? (totalApplications / totalImpressions) * 100 : 0;

  return {
    activeJobs,
    totalImpressions,
    avgDwellTime: 0,
    applyRate: Math.round(applyRate * 10) / 10,
    costPerApplicant: 0,
    timeToHire: 0,
  };
}

export function computeAnalyticsSummary(
  events: AnalyticsEvent[],
  jobs: Job[],
): AnalyticsSummary {
  const viewEvents = events.filter((e) => e.eventType === "job_view");
  const applyEvents = events.filter((e) => e.eventType === "job_apply");

  const impressionsByDate = new Map<string, number>();
  viewEvents.forEach((e) => {
    if (e.timestamp?.toDate) {
      const dateStr = e.timestamp.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric" });
      impressionsByDate.set(dateStr, (impressionsByDate.get(dateStr) ?? 0) + 1);
    }
  });

  const impressionsOverTime = Array.from(impressionsByDate.entries())
    .map(([date, impressions]) => ({ date, impressions }))
    .slice(-8);

  const totalImpressions = viewEvents.length;
  const totalApplies = applyEvents.length;

  const funnelData = [
    { stage: "Impressions", value: totalImpressions, conversion: 100, dropoff: 0 },
    { stage: "Expand", value: Math.round(totalImpressions * 0.3), conversion: 30, dropoff: 70 },
    { stage: "Apply", value: totalApplies, conversion: totalImpressions > 0 ? Math.round((totalApplies / totalImpressions) * 100) : 0, dropoff: totalImpressions > 0 ? Math.round((1 - totalApplies / totalImpressions) * 100) : 0 },
  ];

  const dwellTimeByJob = jobs
    .filter((j) => j.status === "active")
    .map((j) => ({ job: j.title, dwellTime: 0 }))
    .slice(0, 6);

  const applyRate = totalImpressions > 0
    ? Math.round((totalApplies / totalImpressions) * 1000) / 10
    : 0;

  const avgDwellTime = dwellTimeByJob.length > 0
    ? Math.round(dwellTimeByJob.reduce((sum, d) => sum + d.dwellTime, 0) / dwellTimeByJob.length * 10) / 10
    : 0;

  return {
    impressionsOverTime,
    funnelData,
    dwellTimeByJob,
    applyRateTrend: [],
    sourceDistribution: [
      { name: "Organic Feed", value: 62, count: Math.round(totalApplies * 0.62), color: "var(--chart-1)" },
      { name: "Sponsored", value: 28, count: Math.round(totalApplies * 0.28), color: "var(--chart-4)" },
      { name: "Company Profile", value: 7, count: Math.round(totalApplies * 0.07), color: "var(--chart-2)" },
      { name: "Direct Link", value: 3, count: Math.round(totalApplies * 0.03), color: "var(--chart-3)" },
    ],
    benchmarks: {
      applyRate,
      applyRateAvg: 2.8,
      avgDwellTime,
      avgDwellTimeAvg: 19.2,
      costPerApplicant: 0,
      costPerApplicantAvg: 52,
    },
  };
}
