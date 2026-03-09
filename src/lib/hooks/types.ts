export interface JobDisplayRow {
  id: string;
  title: string;
  status: "Active" | "Paused";
  impressions: string;
  dwellTime: string;
  applyRate: string;
  healthScore: number;
  boosted: boolean;
}

export interface CandidateDisplayInfo {
  id: string;
  name: string;
  role: string;
  jobId: string;
  jobTitle: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  fitScore: number;
  intentScore: number;
  engagement: "High" | "Medium" | "Low";
  stage: "Applied" | "Reviewed" | "Interview" | "Offer" | "Hired" | "Rejected";
  appliedDate: string;
  lastActivity: string;
  avatar: string;
  experience: string;
  availability: string;
  currentCompany: string;
  skills: string[];
  note: string;
}

export interface OverviewKpis {
  activeJobs: number;
  totalImpressions: number;
  avgDwellTime: number;
  applyRate: number;
  costPerApplicant: number;
  timeToHire: number;
}

export interface AnalyticsBenchmarks {
  applyRate: number;
  applyRateAvg: number;
  avgDwellTime: number;
  avgDwellTimeAvg: number;
  costPerApplicant: number;
  costPerApplicantAvg: number;
}

export interface AnalyticsSummary {
  impressionsOverTime: { date: string; impressions: number }[];
  funnelData: { stage: string; value: number; conversion: number; dropoff: number }[];
  dwellTimeByJob: { job: string; dwellTime: number }[];
  applyRateTrend: { week: string; rate: number }[];
  sourceDistribution: { name: string; value: number; count: number; color: string }[];
  benchmarks: AnalyticsBenchmarks;
}
