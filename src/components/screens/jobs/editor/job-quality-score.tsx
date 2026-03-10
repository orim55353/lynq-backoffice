"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { panelTransition, premiumEase } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import type { QualityBreakdown, QualitySuggestion } from "@/lib/firebase/types";

// ─── Types ────────────────────────────────────────────────────

interface ScoreState {
  readonly score: number;
  readonly breakdown: QualityBreakdown;
  readonly suggestions: readonly QualitySuggestion[];
  readonly aiLoading: boolean;
  readonly localReady: boolean;
}

interface JobQualityScoreProps {
  readonly scoreState: ScoreState;
  readonly className?: string;
}

// ─── Constants ────────────────────────────────────────────────

const DIMENSIONS: { key: keyof QualityBreakdown; label: string; weight: string }[] = [
  { key: "payTransparency", label: "Pay Transparency", weight: "30%" },
  { key: "shiftClarity", label: "Shift Clarity", weight: "25%" },
  { key: "requirementsClarity", label: "Requirements", weight: "20%" },
  { key: "locationLogistics", label: "Location & Logistics", weight: "15%" },
  { key: "readability", label: "Readability", weight: "10%" },
];

const AI_DIMENSIONS = new Set<keyof QualityBreakdown>(["readability"]);

const RING_SIZE = 100;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// ─── Helpers ──────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger";
}

function getScoreStroke(score: number): string {
  if (score >= 80) return "stroke-success";
  if (score >= 60) return "stroke-warning";
  return "stroke-danger";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Average";
  return "Needs Attention";
}

function getBarColor(value: number): string {
  if (value >= 80) return "bg-success";
  if (value >= 60) return "bg-warning";
  return "bg-danger";
}

function getImpactBadgeClass(impact: QualitySuggestion["impact"]): string {
  const map: Record<QualitySuggestion["impact"], string> = {
    high: "border-0 bg-danger/10 text-danger",
    medium: "border-0 bg-warning/10 text-warning",
    low: "border-0 bg-info/10 text-info",
  };
  return map[impact];
}

// ─── Component ────────────────────────────────────────────────

export function JobQualityScore({ scoreState, className }: JobQualityScoreProps) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const { score, breakdown, suggestions, aiLoading, localReady } = scoreState;

  const dashOffset = RING_CIRCUMFERENCE - (score / 100) * RING_CIRCUMFERENCE;

  if (!localReady) {
    return (
      <div className={cn("rounded-[10px] border-border bg-card p-5 shadow-soft", className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-[100px] w-[100px] animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-5 space-y-3">
          {DIMENSIONS.map(({ key }) => (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between">
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="h-3 w-8 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-1.5 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-[10px] border-border bg-card p-5 shadow-soft", className)}>
      {/* Score Ring */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              strokeWidth={RING_STROKE}
              className="stroke-muted"
            />
            <motion.circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              className={getScoreStroke(score)}
              initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.8, ease: premiumEase }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className={cn("text-xl font-bold", getScoreColor(score))}
              key={score}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={panelTransition}
            >
              {score}
            </motion.span>
          </div>
        </div>
        <span className={cn("text-sm font-medium", getScoreColor(score))}>
          {getScoreLabel(score)}
        </span>
      </div>

      {/* Dimension Bars */}
      <div className="mt-5 space-y-3">
        {DIMENSIONS.map(({ key, label, weight }) => {
          const value = breakdown[key];
          const isAi = AI_DIMENSIONS.has(key);

          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-foreground">
                  {label}
                  {isAi && aiLoading && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </span>
                <span className="text-muted-foreground">{weight}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", getBarColor(value))}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.6, ease: premiumEase, delay: 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <button
            onClick={() => setSuggestionsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between text-sm font-medium text-foreground"
          >
            <span>Suggestions ({suggestions.length})</span>
            {suggestionsOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {suggestionsOpen && (
              <motion.ul
                className="mt-3 space-y-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={panelTransition}
              >
                {suggestions.map((s, i) => (
                  <li
                    key={`${s.field}-${i}`}
                    className="flex items-start gap-2 rounded-md bg-muted/50 p-2 text-xs"
                  >
                    <Badge className={cn("shrink-0 text-[10px]", getImpactBadgeClass(s.impact))}>
                      {s.impact}
                    </Badge>
                    <div>
                      <span className="font-medium text-foreground">{s.field}:</span>{" "}
                      <span className="text-muted-foreground">{s.message}</span>
                    </div>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
