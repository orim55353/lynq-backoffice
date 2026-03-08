"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Candidate,
  CandidateStage,
  candidatesData as initialCandidates,
  jobs,
  stages
} from "@/components/screens/candidates-data";
import { CandidateFullProfileOverlay } from "@/components/screens/candidate-full-profile-overlay";
import { CandidateJobFilterRow } from "@/components/screens/candidates-shared/candidate-job-filter-row";
import { CandidateDetailSidebar } from "@/components/screens/candidates-shared/candidate-detail-sidebar";
import { useResizableSidebar } from "@/components/screens/candidates-shared/use-resizable-sidebar";
import {
  ReviewCandidatesList,
  ReviewModeToggle
} from "@/components/screens/candidate-review/candidate-review-sections";
import {
  CandidateCompareBar,
  CandidateCompareOverlay
} from "@/components/screens/candidate-review/candidate-review-compare";
import { useEntranceMotion } from "@/components/ui/motion";

export function CandidateReviewScreen() {
  const router = useRouter();
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [jobFilter, setJobFilter] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [fullProfileCandidateId, setFullProfileCandidateId] = useState<number | null>(null);
  const [compareIds, setCompareIds] = useState<Set<number>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
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

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedCandidateId) ?? null,
    [candidates, selectedCandidateId]
  );

  const selectedJobTitle = useMemo(
    () => jobs.find((job) => job.id === jobFilter)?.title ?? null,
    [jobFilter]
  );

  const compareCandidates = useMemo(
    () => candidates.filter((candidate) => compareIds.has(candidate.id)),
    [candidates, compareIds]
  );

  const toggleCompareCandidate = useCallback((candidateId: number) => {
    setCompareIds((current) => {
      const next = new Set(current);

      if (next.has(candidateId)) {
        next.delete(candidateId);
        return next;
      }

      if (next.size >= 4) {
        return current;
      }

      next.add(candidateId);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds(new Set());
    setShowCompare(false);
  }, []);

  const handleStageChange = useCallback((candidateId: number, newStage: CandidateStage) => {
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, stage: newStage } : candidate
      )
    );
  }, []);

  const advanceCandidate = useCallback(
    (candidateId: number) => {
      const candidate = candidates.find((currentCandidate) => currentCandidate.id === candidateId);
      if (!candidate) {
        return;
      }

      const currentStageIndex = stages.indexOf(candidate.stage);
      if (currentStageIndex >= 0 && currentStageIndex < stages.length - 2) {
        handleStageChange(candidate.id, stages[currentStageIndex + 1]);
      }
    },
    [candidates, handleStageChange]
  );

  const goNext = useCallback(() => {
    if (!filteredCandidates.length) {
      return;
    }

    if (selectedCandidateId === null) {
      setSelectedCandidateId(filteredCandidates[0].id);
      return;
    }

    const index = filteredCandidates.findIndex((candidate) => candidate.id === selectedCandidateId);
    if (index >= 0 && index < filteredCandidates.length - 1) {
      setSelectedCandidateId(filteredCandidates[index + 1].id);
    }
  }, [filteredCandidates, selectedCandidateId]);

  const goPrevious = useCallback(() => {
    if (!filteredCandidates.length || selectedCandidateId === null) {
      return;
    }

    const index = filteredCandidates.findIndex((candidate) => candidate.id === selectedCandidateId);
    if (index > 0) {
      setSelectedCandidateId(filteredCandidates[index - 1].id);
    }
  }, [filteredCandidates, selectedCandidateId]);

  useEffect(() => {
    setCompareIds((current) => {
      const next = new Set(
        [...current].filter((candidateId) =>
          filteredCandidates.some((candidate) => candidate.id === candidateId)
        )
      );

      return next.size === current.size ? current : next;
    });
  }, [filteredCandidates]);

  useEffect(() => {
    if (compareIds.size < 2 && showCompare) {
      setShowCompare(false);
    }
  }, [compareIds, showCompare]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showCompare) {
        if (event.key === "Escape") {
          setShowCompare(false);
        }
        return;
      }

      if (event.key === "j" || event.key === "ArrowDown") {
        goNext();
      }

      if (event.key === "k" || event.key === "ArrowUp") {
        goPrevious();
      }

      if (selectedCandidate === null) {
        return;
      }

      if (event.key === "e" || event.key === "ArrowRight") {
        advanceCandidate(selectedCandidate.id);
      }

      if (event.key === "x" || event.key === "ArrowLeft") {
        handleStageChange(selectedCandidate.id, "Rejected");
      }

      if (event.key === " ") {
        event.preventDefault();
        toggleCompareCandidate(selectedCandidate.id);
      }

      if ((event.key === "c" || event.key === "C") && compareIds.size >= 2) {
        setShowCompare(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    advanceCandidate,
    compareIds.size,
    goNext,
    goPrevious,
    handleStageChange,
    selectedCandidate,
    showCompare,
    toggleCompareCandidate
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1">Fast Review</h1>
          <p className="text-sm text-muted-foreground">
            <kbd className="rounded bg-muted px-2 py-1 text-xs">J/K</kbd> navigate -{" "}
            <kbd className="rounded bg-muted px-2 py-1 text-xs">E</kbd> advance -{" "}
            <kbd className="rounded bg-muted px-2 py-1 text-xs">X</kbd> reject -{" "}
            <kbd className="rounded bg-muted px-2 py-1 text-xs">Space</kbd> compare -{" "}
            <kbd className="rounded bg-muted px-2 py-1 text-xs">C</kbd> open compare
          </p>
        </div>

        <ReviewModeToggle activeMode="review" onOpenBoard={() => router.push("/candidates")} />
      </div>

      <CandidateJobFilterRow
        selectedJobId={jobFilter}
        totalCount={candidates.length}
        countsByJobId={countsByJobId}
        onSelectJob={setJobFilter}
      />

      <motion.div
        variants={sectionEntrance}
        initial="initial"
        animate="animate"
        style={selectedCandidate ? { paddingRight: `${sidebarWidth + 20}px` } : undefined}
      >
        <ReviewCandidatesList
          candidates={filteredCandidates}
          selectedCandidateId={selectedCandidateId}
          compareCandidateIds={compareIds}
          selectedJobTitle={selectedJobTitle}
          onSelectCandidate={setSelectedCandidateId}
          onToggleCompareCandidate={toggleCompareCandidate}
          onAdvanceCandidate={advanceCandidate}
          onRejectCandidate={(candidateId) => handleStageChange(candidateId, "Rejected")}
          onOpenProfile={setFullProfileCandidateId}
        />

        <CandidateDetailSidebar
          candidate={selectedCandidate}
          sidebarWidth={sidebarWidth}
          onStartResize={startResizing}
          onStageChange={handleStageChange}
          onOpenFullProfile={setFullProfileCandidateId}
          onClose={() => setSelectedCandidateId(null)}
        />
      </motion.div>

      <CandidateFullProfileOverlay
        candidateId={fullProfileCandidateId}
        onClose={() => setFullProfileCandidateId(null)}
      />

      <AnimatePresence initial={false}>
        {compareCandidates.length >= 2 && !showCompare ? (
          <CandidateCompareBar
            candidates={compareCandidates}
            onOpenCompare={() => setShowCompare(true)}
            onClearAll={clearCompare}
          />
        ) : null}
      </AnimatePresence>

      <CandidateCompareOverlay
        candidates={compareCandidates}
        open={showCompare && compareCandidates.length >= 2}
        onClose={() => setShowCompare(false)}
        onClearAll={clearCompare}
        onRemove={(candidateId) => toggleCompareCandidate(candidateId)}
        onStageChange={handleStageChange}
      />
    </div>
  );
}
