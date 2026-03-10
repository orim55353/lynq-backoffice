"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { premiumEase } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/utils/job-lifecycle";
import {
  getStatusColor,
  getStatusLabel,
  getAvailableTransitions,
  getTransitionLabel,
  getTransitionVariant,
  isDestructiveTransition,
} from "@/lib/utils/job-lifecycle";

// ─── Types ────────────────────────────────────────────────────

interface JobStatusBarProps {
  readonly status: JobStatus;
  readonly qualityScore?: number;
  readonly onTransition: (target: JobStatus, reason?: string) => void;
  readonly className?: string;
}

interface ConfirmDialogState {
  readonly target: JobStatus;
  readonly label: string;
}

// ─── Component ────────────────────────────────────────────────

export function JobStatusBar({ status, qualityScore, onTransition, className }: JobStatusBarProps) {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [closeReason, setCloseReason] = useState("");

  const transitions = getAvailableTransitions(status);

  const handleTransitionClick = useCallback(
    (target: JobStatus) => {
      if (isDestructiveTransition(target)) {
        setConfirmDialog({
          target,
          label: getTransitionLabel(status, target),
        });
        return;
      }
      onTransition(target);
    },
    [status, onTransition]
  );

  const handleConfirm = useCallback(() => {
    if (!confirmDialog) return;
    const reason = confirmDialog.target === "closed" ? closeReason.trim() || undefined : undefined;
    onTransition(confirmDialog.target, reason);
    setConfirmDialog(null);
    setCloseReason("");
  }, [confirmDialog, closeReason, onTransition]);

  const handleCancel = useCallback(() => {
    setConfirmDialog(null);
    setCloseReason("");
  }, []);

  const publishDisabled = qualityScore != null && qualityScore < 60;

  return (
    <>
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-[10px] border-border bg-card px-4 py-3 shadow-soft",
          className
        )}
      >
        {/* Current status */}
        <Badge className={cn("border-0", getStatusColor(status))}>
          {getStatusLabel(status)}
        </Badge>

        {/* Transition buttons */}
        {transitions.length > 0 && (
          <div className="flex items-center gap-2">
            {transitions.map((target) => {
              const isPublish = target === "active";
              const disabled = isPublish && publishDisabled;
              const variant = getTransitionVariant(target);
              const label = getTransitionLabel(status, target);

              return (
                <div key={target} className="relative">
                  <Button
                    variant={variant}
                    size="sm"
                    disabled={disabled}
                    onClick={() => handleTransitionClick(target)}
                  >
                    {label}
                  </Button>
                  {disabled && (
                    <div className="absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] text-background opacity-0 transition-opacity hover:opacity-100 peer-hover:opacity-100">
                      Quality score must be at least 60
                    </div>
                  )}
                  {disabled && (
                    <div
                      className="peer absolute inset-0"
                      title="Quality score must be at least 60 to publish"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quality score warning */}
        {publishDisabled && (
          <span className="flex items-center gap-1 text-xs text-warning">
            <AlertTriangle className="h-3.5 w-3.5" />
            Score below 60
          </span>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={handleCancel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Dialog */}
            <motion.div
              className="relative z-10 w-full max-w-md rounded-[10px] border border-border bg-card p-6 shadow-soft"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: premiumEase }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10">
                  <AlertTriangle className="h-5 w-5 text-danger" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {confirmDialog.label} this job?
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {confirmDialog.target === "closed"
                      ? "Closing this job will stop accepting new applications. This action can be reversed by archiving."
                      : "Archiving this job will permanently move it out of active listings."}
                  </p>
                </div>
              </div>

              {/* Close reason input */}
              {confirmDialog.target === "closed" && (
                <div className="mt-4">
                  <Label htmlFor="close-reason" className="text-sm">
                    Reason for closing (optional)
                  </Label>
                  <Input
                    id="close-reason"
                    className="mt-1.5"
                    placeholder="e.g. Position filled, budget constraints..."
                    value={closeReason}
                    onChange={(e) => setCloseReason(e.target.value)}
                  />
                </div>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={handleConfirm}>
                  {confirmDialog.label}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
