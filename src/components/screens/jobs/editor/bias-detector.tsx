"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listItemTransition, premiumEase } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

export interface BiasIssue {
  readonly text: string;
  readonly type: string;
  readonly suggestion: string;
  readonly severity: "high" | "medium" | "low";
}

interface BiasState {
  readonly issues: readonly BiasIssue[];
  readonly loading: boolean;
}

interface BiasDetectorProps {
  readonly biasState: BiasState;
  readonly onFix?: (original: string, suggestion: string) => void;
  readonly className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────

function getSeverityClass(severity: BiasIssue["severity"]): string {
  const map: Record<BiasIssue["severity"], string> = {
    high: "border-0 bg-danger/10 text-danger",
    medium: "border-0 bg-warning/10 text-warning",
    low: "border-0 bg-info/10 text-info",
  };
  return map[severity];
}

function getSeverityBorder(severity: BiasIssue["severity"]): string {
  const map: Record<BiasIssue["severity"], string> = {
    high: "border-l-danger",
    medium: "border-l-warning",
    low: "border-l-info",
  };
  return map[severity];
}

// ─── Component ────────────────────────────────────────────────

export function BiasDetector({ biasState, onFix, className }: BiasDetectorProps) {
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(new Set());

  const handleDismiss = useCallback((issueText: string) => {
    setDismissed((prev) => new Set([...prev, issueText]));
  }, []);

  const { issues, loading } = biasState;
  const visibleIssues = issues.filter((issue) => !dismissed.has(issue.text));

  if (!loading && visibleIssues.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Loading indicator */}
      {loading && (
        <motion.div
          className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={listItemTransition}
        >
          <Loader2 className="h-3 w-3 animate-spin" />
          Checking for bias...
        </motion.div>
      )}

      {/* Issue cards */}
      <AnimatePresence mode="popLayout">
        {visibleIssues.map((issue) => (
          <motion.div
            key={issue.text}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: premiumEase }}
            className={cn(
              "relative rounded-md border border-border border-l-2 bg-card p-3",
              getSeverityBorder(issue.severity)
            )}
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge className={cn("text-[10px]", getSeverityClass(issue.severity))}>
                  {issue.severity}
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">{issue.type}</span>
              </div>
              <button
                onClick={() => handleDismiss(issue.text)}
                className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Flagged text */}
            <p className="mt-2 text-xs text-foreground">
              Flagged: <span className="italic text-muted-foreground">&ldquo;{issue.text}&rdquo;</span>
            </p>

            {/* Suggestion */}
            <p className="mt-1 text-xs text-muted-foreground">
              Suggestion: {issue.suggestion}
            </p>

            {/* Apply fix button */}
            {onFix && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 px-2 text-xs text-lynq-accent hover:bg-lynq-accent-muted hover:text-lynq-accent"
                onClick={() => onFix(issue.text, issue.suggestion)}
              >
                Apply fix
              </Button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
