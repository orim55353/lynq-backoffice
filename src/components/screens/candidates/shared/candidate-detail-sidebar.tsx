"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { CandidateDetailPanel } from "@/components/screens/candidates/candidate-detail-panel";
import { Candidate, CandidateStage } from "@/components/screens/candidates/candidates-data";
import { useCandidateContentMotion, useSidebarMotion } from "@/components/ui/motion";

interface CandidateDetailSidebarProps {
  candidate: Candidate | null;
  sidebarWidth: number;
  onStartResize: (event: ReactMouseEvent<HTMLElement>) => void;
  onStageChange: (candidateId: number, stage: CandidateStage) => void;
  onOpenFullProfile: (candidateId: number) => void;
  onClose: () => void;
}

export function CandidateDetailSidebar({
  candidate,
  sidebarWidth,
  onStartResize,
  onStageChange,
  onOpenFullProfile,
  onClose
}: CandidateDetailSidebarProps) {
  const sidebarMotion = useSidebarMotion();
  const contentMotion = useCandidateContentMotion();

  return (
    <AnimatePresence initial={false}>
      {candidate ? (
        <motion.div
          key="candidate-detail-sidebar"
          variants={sidebarMotion}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-y-0 right-0 z-20 flex border-l border-border bg-card shadow-[-18px_0_40px_-28px_rgba(15,23,42,0.28)]"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div
            className="group absolute inset-y-0 left-0 flex w-1 cursor-ew-resize items-center justify-center bg-border/80 transition-colors duration-150 hover:bg-info"
            onMouseDown={onStartResize}
          >
            <div className="absolute inset-y-0 left-0 flex w-4 items-center justify-center">
              <GripVertical className="h-4 w-4 text-muted-foreground transition-colors duration-150 group-hover:text-info" />
            </div>
          </div>

          <div className="ml-1 flex flex-1 flex-col overflow-hidden overscroll-none bg-card">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={candidate.id}
                variants={contentMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex h-full flex-col"
              >
                <CandidateDetailPanel
                  candidate={candidate}
                  onStageChange={onStageChange}
                  onOpenFullProfile={onOpenFullProfile}
                  onClose={onClose}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
