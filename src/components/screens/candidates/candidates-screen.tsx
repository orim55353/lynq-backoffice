"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Candidate,
  CandidateStage,
} from "@/components/screens/candidates/candidates-data";
import { CandidateFullProfileOverlay } from "@/components/screens/candidates/candidate-full-profile-overlay";
import { ReviewModeToggle } from "@/components/screens/candidates/review/candidate-review-sections";
import { CandidateJobFilterRow } from "@/components/screens/candidates/shared/candidate-job-filter-row";
import { CandidateDetailSidebar } from "@/components/screens/candidates/shared/candidate-detail-sidebar";
import { useResizableSidebar } from "@/components/screens/candidates/shared/use-resizable-sidebar";
import { CandidatesBoardColumns } from "@/components/screens/candidates/board/candidates-board-columns";
import { useEntranceMotion } from "@/components/ui/motion";
import { useCandidates } from "@/lib/hooks/use-candidates";
import { useApplications } from "@/lib/hooks/use-applications";
import { useJobs } from "@/lib/hooks/use-jobs";
import { candidateWithApplication } from "@/lib/hooks/transforms";
import { SkeletonCandidateList } from "@/components/skeletons/skeleton-candidate-list";

export function CandidatesScreen() {
  const router = useRouter();
  const [jobFilter, setJobFilter] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(
    null,
  );
  const [fullProfileCandidateId, setFullProfileCandidateId] = useState<
    number | null
  >(null);
  const { sidebarWidth, startResizing } = useResizableSidebar();
  const sectionEntrance = useEntranceMotion(12);

  const { data: firestoreCandidates, isLoading: candidatesLoading } =
    useCandidates();
  const { data: applications, isLoading: applicationsLoading } =
    useApplications();
  const { data: firestoreJobs, isLoading: jobsLoading } = useJobs();

  const isLoading = candidatesLoading || applicationsLoading || jobsLoading;

  const mappedCandidates: Candidate[] = useMemo(() => {
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

  useEffect(() => {
    if (mappedCandidates.length > 0) {
      setCandidates(mappedCandidates);
    }
  }, [mappedCandidates]);

  const jobsForFilter = useMemo(() => {
    if (!firestoreJobs) return [];
    return firestoreJobs.map((j) => ({ id: j.id, title: j.title }));
  }, [firestoreJobs]);

  const filteredCandidates = useMemo(
    () =>
      jobFilter
        ? candidates.filter((candidate) => candidate.jobId === jobFilter)
        : candidates,
    [candidates, jobFilter],
  );

  const countsByJobId = useMemo(
    () =>
      candidates.reduce<Record<string, number>>((acc, candidate) => {
        acc[candidate.jobId] = (acc[candidate.jobId] ?? 0) + 1;
        return acc;
      }, {}),
    [candidates],
  );

  const selectedCandidate =
    candidates.find((candidate) => candidate.id === selectedCandidateId) ??
    null;

  const handleStageChange = (candidateId: number, newStage: CandidateStage) => {
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, stage: newStage }
          : candidate,
      ),
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1">Candidates</h1>
            <p className="text-sm text-muted-foreground">
              Drag cards between columns to change stages
            </p>
          </div>
        </div>
        <SkeletonCandidateList />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1">Candidates</h1>
            <p className="text-sm text-muted-foreground">
              Drag cards between columns to change stages
            </p>
          </div>

          <ReviewModeToggle
            activeMode="board"
            onOpenReview={() => router.push("/candidates/review")}
          />
        </div>

        <CandidateJobFilterRow
          jobs={jobsForFilter}
          selectedJobId={jobFilter}
          totalCount={candidates.length}
          countsByJobId={countsByJobId}
          onSelectJob={setJobFilter}
        />

        <DndProvider backend={HTML5Backend}>
          <motion.div
            variants={sectionEntrance}
            initial="initial"
            animate="animate"
            className="flex gap-4 overflow-x-auto pb-4"
            style={
              selectedCandidate
                ? { paddingRight: `${sidebarWidth + 20}px` }
                : undefined
            }
          >
            <CandidatesBoardColumns
              candidates={filteredCandidates}
              selectedCandidateId={selectedCandidateId}
              onStageChange={handleStageChange}
              onSelectCandidate={setSelectedCandidateId}
            />
          </motion.div>
        </DndProvider>
      </div>

      <CandidateDetailSidebar
        candidate={selectedCandidate}
        sidebarWidth={sidebarWidth}
        onStartResize={startResizing}
        onStageChange={handleStageChange}
        onOpenFullProfile={setFullProfileCandidateId}
        onClose={() => setSelectedCandidateId(null)}
      />

      <CandidateFullProfileOverlay
        candidateId={fullProfileCandidateId}
        candidates={candidates}
        onClose={() => setFullProfileCandidateId(null)}
      />
    </>
  );
}
