"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  Briefcase,
  Building,
  CheckCircle,
  GitCompareArrows,
  MapPin,
  Minus,
  Sparkles,
  Trophy,
  X,
  XCircle
} from "lucide-react";
import {
  Candidate,
  CandidateStage,
  getEngagementColor,
  getJobColor,
  stages
} from "@/components/screens/candidates/candidates-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { panelTransition } from "@/components/ui/motion";

interface CandidateCompareBarProps {
  candidates: Candidate[];
  onOpenCompare: () => void;
  onClearAll: () => void;
}

interface CandidateCompareOverlayProps {
  candidates: Candidate[];
  open: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onRemove: (id: number) => void;
  onStageChange: (candidateId: number, stage: CandidateStage) => void;
}

type CompareSortKey = "fitScore" | "intentScore" | "experience";

export function CandidateCompareBar({
  candidates,
  onOpenCompare,
  onClearAll
}: CandidateCompareBarProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={panelTransition}
      className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-[22px] border border-border/80 bg-card/95 px-5 py-3 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.5)] backdrop-blur">
        <div className="flex -space-x-2">
          {candidates.slice(0, 4).map((candidate) => (
            <Avatar key={candidate.id} className="h-8 w-8 border-2 border-card">
              <AvatarFallback className="bg-info/10 text-xs text-info">{candidate.avatar}</AvatarFallback>
            </Avatar>
          ))}
        </div>

        <p className="text-sm">
          {candidates.length} selected
          {candidates.length < 4 ? <span className="ml-1 text-muted-foreground">(max 4)</span> : null}
        </p>

        <Button onClick={onOpenCompare} className="gap-2 rounded-xl bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover">
          <GitCompareArrows className="h-4 w-4" />
          Compare
        </Button>

        <Button variant="ghost" size="icon" onClick={onClearAll} className="text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export function CandidateCompareOverlay({
  candidates,
  open,
  onClose,
  onClearAll,
  onRemove,
  onStageChange
}: CandidateCompareOverlayProps) {
  const [sortBy, setSortBy] = useState<CompareSortKey>("fitScore");

  const skillAnalysis = useMemo(() => {
    const allSkills = new Set<string>();
    candidates.forEach((candidate) => candidate.skills.forEach((skill) => allSkills.add(skill)));

    const shared = new Set<string>();
    allSkills.forEach((skill) => {
      if (candidates.every((candidate) => candidate.skills.includes(skill))) {
        shared.add(skill);
      }
    });

    return { shared };
  }, [candidates]);

  const bestFit = Math.max(...candidates.map((candidate) => candidate.fitScore));
  const bestIntent = Math.max(...candidates.map((candidate) => candidate.intentScore));

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
      if (sortBy === "experience") {
        return parseInt(b.experience, 10) - parseInt(a.experience, 10);
      }

      return b[sortBy] - a[sortBy];
    });
  }, [candidates, sortBy]);

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={panelTransition}
          onClick={onClose}
        >
          <motion.div
            className="flex h-full flex-col"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={panelTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-shrink-0 items-center justify-between border-b border-border/80 bg-background/95 px-8 py-5 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <GitCompareArrows className="h-6 w-6 text-info" />
                  <h2 className="text-xl font-bold">Compare Candidates</h2>
                  <Badge className="border border-info/20 bg-info/10 text-info">{candidates.length}</Badge>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Sort:</span>
                  {(["fitScore", "intentScore", "experience"] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSortBy(key)}
                      className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                        sortBy === key ? "bg-info text-white" : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {key === "fitScore" ? "Fit" : key === "intentScore" ? "Intent" : "Experience"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onClearAll} className="text-muted-foreground hover:text-foreground">
                  Clear All
                </Button>
                <Button variant="outline" onClick={onClose} className="gap-2 rounded-xl">
                  <X className="h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-background px-8 py-8">
              <div
                className="grid gap-6"
                style={{ gridTemplateColumns: `repeat(${Math.min(sortedCandidates.length, 4)}, minmax(280px, 1fr))` }}
              >
                {sortedCandidates.map((candidate, index) => (
                  <CompareColumn
                    key={candidate.id}
                    candidate={candidate}
                    rank={index + 1}
                    bestFit={bestFit}
                    bestIntent={bestIntent}
                    sharedSkills={skillAnalysis.shared}
                    onRemove={() => onRemove(candidate.id)}
                    onStageChange={onStageChange}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const percent = Math.round((value / max) * 100);

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

function CompareColumn({
  candidate,
  rank,
  bestFit,
  bestIntent,
  sharedSkills,
  onRemove,
  onStageChange
}: {
  candidate: Candidate;
  rank: number;
  bestFit: number;
  bestIntent: number;
  sharedSkills: Set<string>;
  onRemove: () => void;
  onStageChange: (candidateId: number, stage: CandidateStage) => void;
}) {
  const stageIndex = stages.indexOf(candidate.stage);
  const canAdvance = stageIndex >= 0 && stageIndex < stages.length - 2;
  const isBestFit = candidate.fitScore === bestFit;
  const isBestIntent = candidate.intentScore === bestIntent;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: rank * 0.06 }}
      className={`flex flex-col overflow-hidden rounded-[24px] border bg-card ${
        rank === 1 ? "border-info/40 ring-1 ring-info/20" : "border-border/80"
      }`}
    >
      {rank === 1 ? (
        <div className="flex items-center gap-2 bg-info px-4 py-2 text-white">
          <Trophy className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">Top Match</span>
        </div>
      ) : null}

      <div className="border-b border-border/80 p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-info/10 text-info">{candidate.avatar}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="truncate font-bold">{candidate.name}</h3>
              <p className="truncate text-xs text-muted-foreground">{candidate.role}</p>
            </div>
          </div>

          <button type="button" onClick={onRemove} className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground">
            <Minus className="h-4 w-4" />
          </button>
        </div>

        <Badge className={`${getJobColor(candidate.jobId)} border text-xs`}>{candidate.jobTitle}</Badge>
      </div>

      <div className="space-y-4 border-b border-border/80 p-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Fit Score
            </span>
            <span className={`text-sm font-bold ${isBestFit ? "text-info" : "text-foreground"}`}>
              {candidate.fitScore}
            </span>
          </div>
          <ScoreBar value={candidate.fitScore} color={isBestFit ? "bg-info" : "bg-muted-foreground/40"} />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Intent Score</span>
            <span className={`text-sm font-bold ${isBestIntent ? "text-chart-4" : "text-foreground"}`}>
              {candidate.intentScore}
            </span>
          </div>
          <ScoreBar value={candidate.intentScore} color={isBestIntent ? "bg-chart-4" : "bg-muted-foreground/40"} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Engagement</span>
          <Badge className={`${getEngagementColor(candidate.engagement)} border-0 text-xs`}>
            {candidate.engagement}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 border-b border-border/80 p-5 text-sm">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span>{candidate.experience}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="truncate">{candidate.location}</span>
        </div>
        {candidate.currentCompany ? (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="truncate">{candidate.currentCompany}</span>
          </div>
        ) : null}
        {candidate.availability ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Availability:</span>
            <span className="text-xs">{candidate.availability}</span>
          </div>
        ) : null}
      </div>

      <div className="border-b border-border/80 p-5">
        <h4 className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Skills</h4>
        <div className="flex flex-wrap gap-1.5">
          {candidate.skills.map((skill) => {
            const isShared = sharedSkills.has(skill);

            return (
              <Badge
                key={skill}
                className={`border text-xs ${
                  isShared
                    ? "border-info/20 bg-info/10 text-info"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                {skill}
              </Badge>
            );
          })}
        </div>
        {sharedSkills.size ? (
          <p className="mt-2 text-[10px] text-muted-foreground">Highlighted = shared across all compared candidates</p>
        ) : null}
      </div>

      {candidate.note ? (
        <div className="border-b border-border/80 p-5">
          <h4 className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Notes</h4>
          <p className="text-xs">{candidate.note}</p>
        </div>
      ) : null}

      <div className="mt-auto space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Stage</span>
          <Badge className="border-0 bg-muted/50 text-xs text-foreground">{candidate.stage}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              if (canAdvance) {
                onStageChange(candidate.id, stages[stageIndex + 1]);
              }
            }}
            className="h-9 rounded-lg bg-info text-xs text-white hover:bg-info/90"
          >
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            Advance
          </Button>
          <Button
            variant="outline"
            onClick={() => onStageChange(candidate.id, "Rejected")}
            className="h-9 rounded-lg border-danger/30 text-xs text-danger hover:bg-danger/10"
          >
            <XCircle className="mr-1 h-3.5 w-3.5" />
            Reject
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
