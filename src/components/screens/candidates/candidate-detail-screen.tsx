"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/components/screens/candidates/candidates-data";
import { CandidateFullProfileContent } from "@/components/screens/candidates/candidate-full-profile-content";
import { useCandidates } from "@/lib/hooks/use-candidates";
import { useApplications } from "@/lib/hooks/use-applications";
import { useJobs } from "@/lib/hooks/use-jobs";
import { candidateWithApplication } from "@/lib/hooks/transforms";
import { SkeletonCandidateList } from "@/components/skeletons/skeleton-candidate-list";

interface CandidateDetailScreenProps {
  id: string;
}

export function CandidateDetailScreen({ id }: CandidateDetailScreenProps) {
  const router = useRouter();
  const numericId = Number(id);

  const { data: firestoreCandidates, isLoading: candidatesLoading } = useCandidates();
  const { data: applications, isLoading: applicationsLoading } = useApplications();
  const { data: firestoreJobs, isLoading: jobsLoading } = useJobs();

  const isLoading = candidatesLoading || applicationsLoading || jobsLoading;

  const candidates: Candidate[] = useMemo(() => {
    if (!firestoreCandidates || !applications || !firestoreJobs) return [];
    return firestoreCandidates.map((c, index) => {
      const app = applications.find((a) => a.candidateId === c.id);
      const job = firestoreJobs.find((j) => j.id === app?.jobId);
      const display = candidateWithApplication(c, app, job);
      return {
        id: index + 1,
        name: display.name,
        role: display.role,
        jobId: display.jobId || `job-${index}`,
        jobTitle: display.jobTitle || display.role,
        location: display.location,
        email: display.email,
        phone: display.phone,
        linkedin: display.linkedin,
        fitScore: display.fitScore,
        intentScore: display.intentScore,
        engagement: display.engagement,
        stage: display.stage,
        appliedDate: display.appliedDate || "Recently",
        lastActivity: display.lastActivity || "Applied",
        avatar: display.avatar,
        experience: display.experience,
        availability: display.availability,
        currentCompany: display.currentCompany,
        skills: display.skills,
        note: display.note,
      };
    });
  }, [firestoreCandidates, applications, firestoreJobs]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => router.push("/candidates")} className="-ml-2 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Button>
        </div>
        <SkeletonCandidateList />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push("/candidates")} className="-ml-2 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>
      <CandidateFullProfileContent id={numericId} candidates={candidates} />
    </div>
  );
}
