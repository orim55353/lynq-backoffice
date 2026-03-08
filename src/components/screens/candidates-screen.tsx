"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Candidate,
  CandidateStage,
  candidatesData as initialCandidates
} from "@/components/screens/candidates-data";
import { CandidateFullProfileOverlay } from "@/components/screens/candidate-full-profile-overlay";
import { ReviewModeToggle } from "@/components/screens/candidate-review/candidate-review-sections";
import { CandidateJobFilterRow } from "@/components/screens/candidates-shared/candidate-job-filter-row";
import { CandidateDetailSidebar } from "@/components/screens/candidates-shared/candidate-detail-sidebar";
import { useResizableSidebar } from "@/components/screens/candidates-shared/use-resizable-sidebar";
import { CandidatesBoardColumns } from "@/components/screens/candidates-board/candidates-board-columns";
import { useEntranceMotion } from "@/components/ui/motion";

export function CandidatesScreen() {
  const router = useRouter();
  const [jobFilter, setJobFilter] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [fullProfileCandidateId, setFullProfileCandidateId] = useState<number | null>(null);
  const { sidebarWidth, startResizing } = useResizableSidebar();
  const sectionEntrance = useEntranceMotion(12);

  const filteredCandidates = useMemo(
    () => (jobFilter ? candidates.filter((candidate) => candidate.jobId === jobFilter) : candidates),
    [candidates, jobFilter]
  );

  const countsByJobId = useMemo(
    () =>
      candidates.reduce<Record<string, number>>((acc, candidate) => {
        acc[candidate.jobId] = (acc[candidate.jobId] ?? 0) + 1;
        return acc;
      }, {}),
    [candidates]
  );

  const selectedCandidate = candidates.find((candidate) => candidate.id === selectedCandidateId) ?? null;

  const handleStageChange = (candidateId: number, newStage: CandidateStage) => {
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, stage: newStage } : candidate
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1">Candidates</h1>
          <p className="text-sm text-muted-foreground">Drag cards between columns to change stages</p>
        </div>

        <ReviewModeToggle activeMode="board" onOpenReview={() => router.push("/candidates/review")} />
      </div>

      <CandidateJobFilterRow
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
          style={selectedCandidate ? { paddingRight: `${sidebarWidth + 20}px` } : undefined}
        >
          <CandidatesBoardColumns
            candidates={filteredCandidates}
            selectedCandidateId={selectedCandidateId}
            onStageChange={handleStageChange}
            onSelectCandidate={setSelectedCandidateId}
          />
        </motion.div>
      </DndProvider>

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
        onClose={() => setFullProfileCandidateId(null)}
      />
    </div>
  );
}
