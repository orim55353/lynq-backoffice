"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { premiumEase } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

export type AIFieldName =
  | "title"
  | "hook"
  | "description"
  | "requirements"
  | "benefits";

export interface OptimizeFieldResult {
  readonly optimized: string;
  readonly reasoning: string;
  readonly confidence: number;
}

interface AIOptimizeButtonProps {
  readonly field: AIFieldName;
  readonly currentValue: string;
  readonly jobContext: Record<string, unknown>;
  readonly onAccept: (value: string) => void;
  readonly isLoading?: boolean;
  readonly result?: OptimizeFieldResult | null;
  readonly onOptimize: () => void;
  readonly onDismiss: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "text-success";
  if (confidence >= 0.6) return "text-warning";
  return "text-danger";
}

// ─── Component ────────────────────────────────────────────────

export function AIOptimizeButton({
  field,
  currentValue,
  onAccept,
  isLoading = false,
  result = null,
  onOptimize,
  onDismiss,
}: AIOptimizeButtonProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPopoverPos({
      top: rect.bottom + 8 + window.scrollY,
      left: Math.max(8, rect.left + window.scrollX - 140),
    });
  }, []);

  const handleClick = useCallback(() => {
    if (result) {
      updatePosition();
      setShowPopover(true);
      return;
    }
    onOptimize();
    updatePosition();
    setShowPopover(true);
  }, [result, onOptimize, updatePosition]);

  const handleAccept = useCallback(() => {
    if (!result) return;
    onAccept(result.optimized);
    setShowPopover(false);
    onDismiss();
  }, [result, onAccept, onDismiss]);

  const handleReject = useCallback(() => {
    setShowPopover(false);
    onDismiss();
  }, [onDismiss]);

  // Close popover on escape
  useEffect(() => {
    if (!showPopover) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPopover(false);
        onDismiss();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showPopover, onDismiss]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded p-1 transition-colors",
          "text-muted-foreground hover:text-lynq-accent hover:bg-lynq-accent-muted",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        title={`Optimize ${field} with AI`}
        aria-label={`Optimize ${field} with AI`}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
      </button>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showPopover && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={handleReject}
                />

                {/* Popover */}
                <motion.div
                  className="absolute z-50 w-72 rounded-[10px] border border-border bg-card p-4 shadow-soft"
                  style={{ top: popoverPos.top, left: popoverPos.left }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease: premiumEase }}
                >
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Optimizing {field}...
                    </div>
                  )}

                  {!isLoading && result && (
                    <div className="space-y-3">
                      {/* Current value */}
                      <div>
                        <span className="text-[10px] font-medium uppercase text-muted-foreground">
                          Current
                        </span>
                        <p className="mt-0.5 text-xs text-muted-foreground line-through line-clamp-2">
                          {currentValue}
                        </p>
                      </div>

                      {/* Optimized value */}
                      <div>
                        <span className="text-[10px] font-medium uppercase text-success">
                          Optimized
                        </span>
                        <p className="mt-0.5 text-xs text-foreground line-clamp-3">
                          {result.optimized}
                        </p>
                      </div>

                      {/* Reasoning */}
                      <p className="text-[11px] italic text-muted-foreground">
                        {result.reasoning}
                      </p>

                      {/* Confidence */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className={cn("font-medium", getConfidenceColor(result.confidence))}>
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          className="h-7 flex-1 gap-1 bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover"
                          onClick={handleAccept}
                        >
                          <Check className="h-3 w-3" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 flex-1 gap-1"
                          onClick={handleReject}
                        >
                          <X className="h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {!isLoading && !result && (
                    <p className="text-xs text-muted-foreground">
                      No optimization available for this field.
                    </p>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
