export const stages = ["Applied", "Reviewed", "Interview", "Offer", "Hired", "Rejected"] as const;

export type CandidateStage = (typeof stages)[number];

export type CandidateEngagement = "High" | "Medium" | "Low";

export interface Candidate {
  id: number;
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
  engagement: CandidateEngagement;
  stage: CandidateStage;
  appliedDate: string;
  lastActivity: string;
  avatar: string;
  experience: string;
  availability: string;
  currentCompany: string;
  skills: string[];
  note: string;
}

export const JOB_COLORS: Record<string, string> = {
  "job-1": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "job-2": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  "job-3": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "job-4": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "job-5": "bg-rose-500/10 text-rose-500 border-rose-500/20",
  "job-6": "bg-teal-500/10 text-teal-500 border-teal-500/20",
};

const COLOR_PALETTE = [
  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "bg-rose-500/10 text-rose-500 border-rose-500/20",
  "bg-teal-500/10 text-teal-500 border-teal-500/20",
  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "bg-orange-500/10 text-orange-500 border-orange-500/20",
];

export const getEngagementColor = (engagement: CandidateEngagement) => {
  if (engagement === "High") return "bg-success/10 text-success";
  if (engagement === "Medium") return "bg-warning/10 text-warning";
  return "bg-muted text-muted-foreground";
};

export const getJobColor = (jobId: string) => {
  if (JOB_COLORS[jobId]) return JOB_COLORS[jobId];
  const hash = jobId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
};

export function getCandidateById(candidates: Candidate[], id: number) {
  return candidates.find((candidate) => candidate.id === id);
}
