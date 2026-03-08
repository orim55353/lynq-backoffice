"use client";

import { useMemo } from "react";
import { getCandidateById } from "@/components/screens/candidates-data";
import {
  CandidateDetailViewModel,
  CandidatePrimaryColumn,
  CandidateProfileHeader,
  CandidateSecondaryColumn
} from "@/components/screens/candidate-detail/candidate-detail-sections";

interface CandidateFullProfileContentProps {
  id: number;
  compact?: boolean;
}

const fallbackCandidate: CandidateDetailViewModel = {
  id: 0,
  name: "Candidate",
  avatar: "C",
  email: "candidate@email.com",
  phone: "+1 (555) 555-5555",
  location: "Location unavailable",
  role: "Role unavailable",
  fitScore: 0,
  intentScore: 0,
  engagement: "Medium",
  skills: ["No skill data"],
  matchExplanation: "No explanation available for this candidate.",
  engagementBehavior: ["No behavior data yet"],
  experience: [
    {
      title: "Experience unavailable",
      company: "",
      duration: "",
      description: ""
    }
  ],
  education: [
    {
      degree: "Education unavailable",
      school: "",
      year: ""
    }
  ],
  timeline: [{ date: "", event: "No activity timeline", type: "system" as const }]
};

function getCandidateDetailViewModel(id: number): CandidateDetailViewModel {
  const candidate = getCandidateById(id);

  if (!candidate) {
    return fallbackCandidate;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    avatar: candidate.avatar,
    email: candidate.email,
    phone: candidate.phone,
    location: candidate.location,
    role: candidate.role,
    fitScore: candidate.fitScore,
    intentScore: candidate.intentScore,
    engagement: candidate.engagement,
    skills: candidate.skills,
    matchExplanation:
      candidate.note ||
      "Strong alignment with role requirements and high engagement signals from the candidate journey.",
    engagementBehavior: [
      candidate.lastActivity,
      "Viewed job description multiple times",
      "Reviewed company profile",
      `Applied ${candidate.appliedDate}`
    ],
    experience: [
      {
        title: candidate.role,
        company: candidate.currentCompany || "Independent",
        duration: candidate.experience,
        description: "Hands-on product work and team collaboration in high-growth environments."
      }
    ],
    education: [
      {
        degree: "Bachelor's Degree",
        school: "Top University",
        year: "2019"
      }
    ],
    timeline: [
      { date: "Today", event: "Application reviewed", type: "system" as const },
      { date: "Yesterday", event: candidate.lastActivity, type: "engagement" as const },
      { date: "2 days ago", event: "Viewed job details", type: "engagement" as const }
    ]
  };
}

export function CandidateFullProfileContent({ id, compact = false }: CandidateFullProfileContentProps) {
  const data = useMemo(() => getCandidateDetailViewModel(id), [id]);

  return (
    <div className={compact ? "space-y-5" : "space-y-6"}>
      <CandidateProfileHeader data={data} />

      <div className={compact ? "grid grid-cols-1 gap-5 xl:grid-cols-3" : "grid grid-cols-1 gap-6 xl:grid-cols-3"}>
        <CandidatePrimaryColumn data={data} />
        <CandidateSecondaryColumn data={data} />
      </div>
    </div>
  );
}
