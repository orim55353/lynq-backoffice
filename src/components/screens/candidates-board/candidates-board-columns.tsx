"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useDrag, useDrop } from "react-dnd";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Candidate,
  CandidateStage,
  getEngagementColor,
  getJobColor,
  stages
} from "@/components/screens/candidates-data";
import { layoutSpring, useLiftMotion, useTapMotion } from "@/components/ui/motion";
import { Sparkles } from "lucide-react";

const CANDIDATE_ITEM = "candidate";

interface CandidatesBoardColumnsProps {
  candidates: Candidate[];
  selectedCandidateId: number | null;
  onStageChange: (candidateId: number, stage: CandidateStage) => void;
  onSelectCandidate: (candidateId: number) => void;
}

export function CandidatesBoardColumns({
  candidates,
  selectedCandidateId,
  onStageChange,
  onSelectCandidate
}: CandidatesBoardColumnsProps) {
  return (
    <LayoutGroup>
      {stages.map((stage) => (
        <KanbanColumn
          key={stage}
          stage={stage}
          candidates={candidates.filter((candidate) => candidate.stage === stage)}
          selectedCandidateId={selectedCandidateId}
          onStageChange={onStageChange}
          onSelectCandidate={onSelectCandidate}
        />
      ))}
    </LayoutGroup>
  );
}

function KanbanColumn({
  stage,
  candidates,
  selectedCandidateId,
  onStageChange,
  onSelectCandidate
}: {
  stage: CandidateStage;
  candidates: Candidate[];
  selectedCandidateId: number | null;
  onStageChange: (candidateId: number, stage: CandidateStage) => void;
  onSelectCandidate: (candidateId: number) => void;
}) {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: CANDIDATE_ITEM,
      drop: (item: { id: number }) => onStageChange(item.id, stage),
      collect: (monitor) => ({
        isOver: monitor.isOver()
      })
    }),
    [onStageChange, stage]
  );

  return (
    <motion.div
      layout
      ref={(node) => {
        dropRef(node);
      }}
      animate={{
        y: isOver ? -2 : 0,
        scale: isOver ? 1.01 : 1,
        boxShadow: isOver ? "0 22px 50px -30px rgba(14, 165, 233, 0.45)" : "0 0 0 rgba(0,0,0,0)"
      }}
      transition={layoutSpring}
      className="w-80 flex-shrink-0"
    >
      <div
        className={`rounded-[28px] border bg-card p-4 shadow-soft transition-colors duration-200 ${
          isOver ? "border-info/50 bg-info/5" : "border-border/80"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium">{stage}</h3>
          <Badge className="border-0 bg-muted text-xs text-muted-foreground">{candidates.length}</Badge>
        </div>

        <motion.div layout className="space-y-2">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={candidate.id === selectedCandidateId}
              onSelect={() => onSelectCandidate(candidate.id)}
            />
          ))}
        </motion.div>

        {candidates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center text-sm text-muted-foreground"
          >
            No candidates
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

function CandidateCard({
  candidate,
  isSelected,
  onSelect
}: {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const hoverLift = useLiftMotion();
  const tapMotion = useTapMotion();

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: CANDIDATE_ITEM,
      item: { id: candidate.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [candidate.id]
  );

  return (
    <motion.div
      layout
      layoutId={`candidate-card-${candidate.id}`}
      ref={(node) => {
        dragRef(node);
      }}
      onClick={onSelect}
      whileHover={hoverLift}
      whileTap={tapMotion}
      transition={layoutSpring}
      className={`cursor-pointer rounded-[22px] border bg-background p-3 shadow-sm transition-colors duration-200 ${
        isDragging ? "opacity-50" : ""
      } ${
        isSelected
          ? "border-info/35 shadow-[0_18px_46px_-28px_rgba(14,165,233,0.35)]"
          : "border-border/50 hover:border-border shadow-[0_10px_30px_-24px_rgba(15,23,42,0.28)]"
      }`}
    >
      <div className="mb-2">
        <Badge className={`${getJobColor(candidate.jobId)} border text-xs font-medium`}>
          {candidate.jobTitle}
        </Badge>
      </div>

      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-info/10 text-[0px] text-info" />
        </Avatar>
        <div className="min-w-0 flex-1 space-y-0.5">
          <h4 className="truncate text-sm font-medium">{candidate.name}</h4>
          <p className="truncate text-xs text-muted-foreground">
            {candidate.experience} - {candidate.availability || "Open to discuss"}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs">
          <span className="text-muted-foreground">Fit Score</span>
          <div className="flex items-center justify-end gap-1">
            <Sparkles className="h-3 w-3 text-info" />
            <span className="font-medium text-info">{candidate.fitScore}</span>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs">
          <span className="text-muted-foreground">Intent Score</span>
          <span className="text-right font-medium">{candidate.intentScore}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <Badge className={`${getEngagementColor(candidate.engagement)} border-0 text-xs`}>
          {candidate.engagement}
        </Badge>
        <span className="shrink-0 text-xs text-muted-foreground">{candidate.appliedDate}</span>
      </div>
    </motion.div>
  );
}
