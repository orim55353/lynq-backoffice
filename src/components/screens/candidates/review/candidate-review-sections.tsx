"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, type PanInfo, useMotionValue, useTransform } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Columns2,
  LayoutGrid,
  Sparkles,
  XCircle,
  Zap
} from "lucide-react";
import { Candidate, getEngagementColor, getJobColor, stages } from "@/components/screens/candidates/candidates-data";
import {
  layoutSpring,
  listItemTransition,
  premiumEase,
  useEntranceMotion,
  useLiftMotion,
  useTapMotion
} from "@/components/ui/motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReviewModeToggleProps {
  activeMode: "board" | "review";
  onOpenBoard?: () => void;
  onOpenReview?: () => void;
}

interface ReviewCandidatesListProps {
  candidates: Candidate[];
  selectedCandidateId: number | null;
  compareCandidateIds: Set<number>;
  selectedJobTitle: string | null;
  onSelectCandidate: (candidateId: number) => void;
  onToggleCompareCandidate: (candidateId: number) => void;
  onAdvanceCandidate: (candidateId: number) => void;
  onRejectCandidate: (candidateId: number) => void;
  onOpenProfile: (candidateId: number) => void;
}

export function ReviewModeToggle({
  activeMode,
  onOpenBoard,
  onOpenReview
}: ReviewModeToggleProps) {
  const hoverLift = useLiftMotion();
  const tapMotion = useTapMotion();

  const options = [
    { id: "review" as const, label: "Fast Review", icon: Zap, onClick: onOpenReview },
    { id: "board" as const, label: "Board", icon: LayoutGrid, onClick: onOpenBoard }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={listItemTransition}
      className="-mt-1 inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/70 p-1.5 pt-2 shadow-sm backdrop-blur"
    >
      {options.map((option) => {
        const active = option.id === activeMode;
        const Icon = option.icon;

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={option.onClick}
            whileHover={active ? undefined : hoverLift}
            whileTap={tapMotion}
            transition={layoutSpring}
            className={`relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${active ? "text-lynq-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {active ? (
              <motion.span
                layoutId="candidate-mode-toggle-pill"
                className="absolute inset-0 rounded-full bg-lynq-accent shadow-sm"
                transition={layoutSpring}
              />
            ) : null}
            <span className="relative z-10 inline-flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {option.label}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export function ReviewCandidatesList({
  candidates,
  selectedCandidateId,
  compareCandidateIds,
  selectedJobTitle,
  onSelectCandidate,
  onToggleCompareCandidate,
  onAdvanceCandidate,
  onRejectCandidate,
  onOpenProfile
}: ReviewCandidatesListProps) {
  const listEntrance = useEntranceMotion(14);
  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (selectedCandidateId === null) {
      return;
    }

    const selectedRow = rowRefs.current.get(selectedCandidateId);
    selectedRow?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedCandidateId]);

  return (
    <motion.div
      variants={listEntrance}
      initial="initial"
      animate="animate"
      className="overflow-hidden rounded-[24px] border border-border/80 bg-card shadow-soft"
    >
      <div className="flex items-center justify-between border-b border-border/80 p-5">
        <h2 className="text-sm font-medium">
          {candidates.length} Candidate{candidates.length !== 1 ? "s" : ""}
          {selectedJobTitle ? <span className="ml-2 font-normal text-muted-foreground">- {selectedJobTitle}</span> : null}
        </h2>
      </div>

      <motion.div layout className="space-y-2 p-3">
        {candidates.map((candidate) => (
          <ReviewCandidateRow
            key={candidate.id}
            candidate={candidate}
            isSelected={candidate.id === selectedCandidateId}
            hasSelectedCandidate={selectedCandidateId !== null}
            isCompareSelected={compareCandidateIds.has(candidate.id)}
            rowRef={(node) => {
              if (node) {
                rowRefs.current.set(candidate.id, node);
                return;
              }

              rowRefs.current.delete(candidate.id);
            }}
            onSelect={() => onSelectCandidate(candidate.id)}
            onToggleCompare={() => onToggleCompareCandidate(candidate.id)}
            onAdvance={() => onAdvanceCandidate(candidate.id)}
            onReject={() => onRejectCandidate(candidate.id)}
            onOpenProfile={() => onOpenProfile(candidate.id)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function ReviewCandidateRow({
  candidate,
  isSelected,
  hasSelectedCandidate,
  isCompareSelected,
  rowRef,
  onSelect,
  onToggleCompare,
  onAdvance,
  onReject,
  onOpenProfile
}: {
  candidate: Candidate;
  isSelected: boolean;
  hasSelectedCandidate: boolean;
  isCompareSelected: boolean;
  rowRef: (node: HTMLDivElement | null) => void;
  onSelect: () => void;
  onToggleCompare: () => void;
  onAdvance: () => void;
  onReject: () => void;
  onOpenProfile: () => void;
}) {
  const tapMotion = useTapMotion();
  const x = useMotionValue(0);
  const [dismissedDirection, setDismissedDirection] = useState<"left" | "right" | null>(null);
  const isDraggingRef = useRef(false);
  const dragTravelRef = useRef(0);
  const currentStageIndex = stages.indexOf(candidate.stage);
  const canAdvance = currentStageIndex >= 0 && currentStageIndex < stages.length - 2;
  const rejectOpacity = useTransform(x, [-144, -96, -24, 0], [1, 0.75, 0.18, 0]);
  const advanceOpacity = useTransform(x, [0, 24, 96, 144], [0, 0.18, 0.75, 1]);
  const rejectScale = useTransform(x, [-144, -72, 0], [1, 0.96, 0.92]);
  const advanceScale = useTransform(x, [0, 72, 144], [0.92, 0.96, 1]);
  const restingVisualState = isSelected
    ? {
        borderColor: "rgba(14, 165, 233, 0.6)",
        boxShadow: "0 18px 44px -28px rgba(15,23,42,0.45)"
      }
    : isCompareSelected
      ? {
          borderColor: "rgba(14, 165, 233, 0.3)",
          boxShadow: "0 10px 24px -22px rgba(8,145,178,0.28)"
        }
      : {
          borderColor: "rgba(148, 163, 184, 0.5)",
          boxShadow: "0 8px 22px -22px rgba(15,23,42,0.3)"
        };

  const animateBackToOrigin = () =>
    animate(x, 0, {
      duration: 0.22,
      ease: premiumEase
    });

  useEffect(() => {
    if (dismissedDirection !== null) {
      setDismissedDirection(null);
      void animate(x, 0, {
        duration: 0.22,
        ease: premiumEase
      });
      isDraggingRef.current = false;
      dragTravelRef.current = 0;
    }
  }, [candidate.stage, dismissedDirection, x]);

  const handleSwipeCommit = (direction: "left" | "right") => {
    setDismissedDirection(direction);
    void animate(x, direction === "right" ? 164 : -164, {
      duration: 0.18,
      ease: premiumEase
    });

    window.setTimeout(() => {
      if (direction === "right") {
        onAdvance();
      } else {
        onReject();
      }

      isDraggingRef.current = false;
      dragTravelRef.current = 0;
    }, 180);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    const swipeThreshold = 104;

    if (offset.x >= swipeThreshold && canAdvance) {
      handleSwipeCommit("right");
    } else if (offset.x <= -swipeThreshold) {
      handleSwipeCommit("left");
    } else {
      void animateBackToOrigin();
    }

    window.setTimeout(() => {
      isDraggingRef.current = false;
      dragTravelRef.current = 0;
    }, 0);
  };

  return (
    <div className="relative overflow-hidden rounded-[22px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
        <motion.div
          style={{ opacity: advanceOpacity }}
          className="absolute inset-y-0 left-0 flex w-[38%] items-center justify-start bg-info/10 pl-4 text-info"
        >
          <motion.div
            style={{ scale: advanceScale }}
            className="inline-flex items-center gap-2 rounded-full border border-info/30 bg-info/12 px-3 py-1.5 text-sm font-semibold shadow-[0_8px_18px_-16px_rgba(8,145,178,0.55)]"
          >
            <ArrowRight className="h-4 w-4" />
            <span>{canAdvance ? "Advance" : "No Next Stage"}</span>
          </motion.div>
        </motion.div>
        <motion.div
          style={{ opacity: rejectOpacity }}
          className="absolute inset-y-0 right-0 flex w-[38%] items-center justify-end bg-danger/10 pr-4 text-danger"
        >
          <motion.div
            style={{ scale: rejectScale }}
            className="inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/12 px-3 py-1.5 text-sm font-semibold shadow-[0_8px_18px_-16px_rgba(220,38,38,0.55)]"
          >
            <span>Reject</span>
            <XCircle className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        layout
        ref={rowRef}
        tabIndex={-1}
        initial={{ opacity: 0, y: 14 }}
        animate={{
          opacity: dismissedDirection ? 0.96 : 1,
          y: 0,
          borderColor: restingVisualState.borderColor,
          boxShadow: restingVisualState.boxShadow
        }}
        transition={layoutSpring}
        drag={dismissedDirection ? false : "x"}
        dragConstraints={{ left: -164, right: 164 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => {
          isDraggingRef.current = true;
          dragTravelRef.current = 0;
        }}
        onDrag={(_event, info) => {
          dragTravelRef.current = Math.max(dragTravelRef.current, Math.abs(info.offset.x));
        }}
        onDragEnd={handleDragEnd}
        onTap={() => {
          onSelect();
        }}
        aria-selected={isSelected}
        style={{ x }}
        whileHover={
          dismissedDirection || isSelected || hasSelectedCandidate
            ? undefined
            : {
                borderColor: "rgba(148, 163, 184, 0.45)",
                boxShadow: "0 12px 28px -20px rgba(15,23,42,0.36)"
              }
        }
        whileTap={tapMotion}
        className="relative cursor-pointer rounded-[22px] border bg-background p-4 outline-none transition-[background-color] duration-150"
      >
        {isSelected ? (
          <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-2 ring-info/30 ring-inset" />
        ) : null}

        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-info/10 text-sm text-info">{candidate.avatar}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <h4 className="truncate text-sm font-semibold">{candidate.name}</h4>
                <p className="truncate text-xs text-muted-foreground">{candidate.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${getJobColor(candidate.jobId)} border text-xs`}>
                  {candidate.jobTitle}
                </Badge>
                <button
                  type="button"
                  aria-pressed={isCompareSelected}
                  aria-label={isCompareSelected ? "Remove from compare" : "Add to compare"}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleCompare();
                  }}
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-150 ${
                    isCompareSelected
                      ? "border-info/30 bg-info text-white shadow-[0_8px_18px_-16px_rgba(8,145,178,0.6)]"
                      : "border-border/80 bg-background text-muted-foreground hover:border-info/30 hover:bg-info/5 hover:text-info"
                  }`}
                >
                  {isCompareSelected ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Columns2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-info">
                <Sparkles className="h-3 w-3" />
                {candidate.fitScore}
              </span>
              <span className="text-muted-foreground">Intent: {candidate.intentScore}</span>
              <Badge className={`${getEngagementColor(candidate.engagement)} border-0 text-xs`}>
                {candidate.engagement}
              </Badge>
              <Badge className="border-0 bg-muted text-xs text-foreground">{candidate.stage}</Badge>
              <span className="ml-auto text-muted-foreground">{candidate.appliedDate}</span>
            </div>

            <div
              className="mt-3 flex items-center gap-2"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <Button
                size="sm"
                className="h-8 bg-info text-white shadow-sm transition-[box-shadow,transform,ring-color,ring-offset-width] duration-150 hover:shadow-[0_8px_18px_-14px_rgba(8,145,178,0.8)] hover:ring-2 hover:ring-white/75 hover:ring-offset-1 hover:ring-offset-info"
                onClick={onAdvance}
              >
                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                Advance
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-danger/30 bg-background text-danger transition-[background-color,border-color,box-shadow] duration-150 hover:border-danger/45 hover:bg-danger/10 hover:shadow-[0_8px_18px_-16px_rgba(220,38,38,0.45)] hover:ring-2 hover:ring-danger/10"
                onClick={onReject}
              >
                <XCircle className="mr-1 h-3.5 w-3.5" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto h-8 border-info/20 bg-info/5 text-info transition-[background-color,border-color,color,box-shadow,transform] duration-150 hover:border-info/40 hover:bg-info/12 hover:text-info hover:shadow-[0_8px_18px_-16px_rgba(8,145,178,0.45)] hover:ring-2 hover:ring-info/12"
                onClick={onOpenProfile}
              >
                <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                Open Full Profile
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
