"use client";

import { useDeferredValue, useMemo } from "react";
import { useJobs } from "./use-jobs";
import { useCandidates } from "./use-candidates";
import { useCampaigns } from "./use-campaigns";
import { useApplications } from "./use-applications";
import type { Job, Candidate, Campaign, Application } from "@/lib/firebase/types";

export interface SearchResultItem {
  id: string;
  type: "job" | "candidate" | "campaign" | "application";
  title: string;
  subtitle: string;
  status?: string;
  href: string;
}

const MAX_PER_CATEGORY = 5;

function matchesTokens(tokens: string[], ...fields: (string | string[] | undefined)[]): boolean {
  return tokens.every((token) =>
    fields.some((field) => {
      if (!field) return false;
      if (Array.isArray(field)) return field.some((f) => f.toLowerCase().includes(token));
      return field.toLowerCase().includes(token);
    })
  );
}

function searchJobs(jobs: Job[], tokens: string[]): SearchResultItem[] {
  return jobs
    .filter((j) =>
      matchesTokens(tokens, j.title, j.department, j.location, j.type, j.status, j.skills)
    )
    .slice(0, MAX_PER_CATEGORY)
    .map((j) => ({
      id: j.id,
      type: "job" as const,
      title: j.title,
      subtitle: `${j.department} · ${j.location}`,
      status: j.status,
      href: `/jobs/${j.id}/edit`,
    }));
}

function searchCandidates(candidates: Candidate[], tokens: string[]): SearchResultItem[] {
  return candidates
    .filter((c) =>
      matchesTokens(tokens, c.name, c.email, c.currentRole, c.currentCompany, c.skills, c.tags)
    )
    .slice(0, MAX_PER_CATEGORY)
    .map((c) => ({
      id: c.id,
      type: "candidate" as const,
      title: c.name,
      subtitle: `${c.currentRole} at ${c.currentCompany}`,
      href: `/candidates/${c.id}`,
    }));
}

function searchCampaigns(campaigns: Campaign[], tokens: string[]): SearchResultItem[] {
  return campaigns
    .filter((c) => matchesTokens(tokens, c.name, c.status))
    .slice(0, MAX_PER_CATEGORY)
    .map((c) => ({
      id: c.id,
      type: "campaign" as const,
      title: c.name,
      subtitle: `Budget: ${c.currency} ${c.budget.toLocaleString()}`,
      status: c.status,
      href: "/sponsored",
    }));
}

function findApplicationsForJobs(
  matchedJobIds: Set<string>,
  applications: Application[],
  candidatesById: Map<string, Candidate>,
  jobsById: Map<string, Job>
): SearchResultItem[] {
  return applications
    .filter((a) => matchedJobIds.has(a.jobId))
    .slice(0, MAX_PER_CATEGORY)
    .map((a) => {
      const candidate = candidatesById.get(a.candidateId);
      const job = jobsById.get(a.jobId);
      return {
        id: a.id,
        type: "application" as const,
        title: candidate?.name ?? a.candidateId,
        subtitle: job ? `Applied to ${job.title}` : `Application`,
        status: a.status,
        href: `/candidates/${a.candidateId}`,
      };
    });
}

export function useGlobalSearch(query: string) {
  const deferredQuery = useDeferredValue(query);
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: candidates, isLoading: candidatesLoading } = useCandidates();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: applications, isLoading: applicationsLoading } = useApplications();

  const isLoading = jobsLoading || candidatesLoading || campaignsLoading || applicationsLoading;

  const results = useMemo(() => {
    const trimmed = deferredQuery.trim().toLowerCase();
    if (!trimmed) return { jobs: [], candidates: [], campaigns: [], applications: [], totalCount: 0 };

    const tokens = trimmed.split(/\s+/);
    const matchedJobs = searchJobs(jobs ?? [], tokens);
    const matchedCandidates = searchCandidates(candidates ?? [], tokens);
    const matchedCampaigns = searchCampaigns(campaigns ?? [], tokens);

    // Find applications related to matched jobs
    const matchedJobIds = new Set(matchedJobs.map((j) => j.id));
    const candidatesById = new Map((candidates ?? []).map((c) => [c.id, c]));
    const jobsById = new Map((jobs ?? []).map((j) => [j.id, j]));
    const matchedApplications = matchedJobIds.size > 0
      ? findApplicationsForJobs(matchedJobIds, applications ?? [], candidatesById, jobsById)
      : [];

    return {
      jobs: matchedJobs,
      candidates: matchedCandidates,
      campaigns: matchedCampaigns,
      applications: matchedApplications,
      totalCount: matchedJobs.length + matchedCandidates.length + matchedCampaigns.length + matchedApplications.length,
    };
  }, [deferredQuery, jobs, candidates, campaigns, applications]);

  return { ...results, isLoading };
}
