"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCandidateById } from "@/components/screens/candidates-data";
import { CandidateFullProfileContent } from "@/components/screens/candidate-full-profile-content";
import { panelTransition } from "@/components/ui/motion";

interface CandidateFullProfileOverlayProps {
  candidateId: number | null;
  onClose: () => void;
}

export function CandidateFullProfileOverlay({
  candidateId,
  onClose
}: CandidateFullProfileOverlayProps) {
  const candidate = candidateId !== null ? getCandidateById(candidateId) : null;

  useEffect(() => {
    if (candidateId === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [candidateId, onClose]);

  return (
    <AnimatePresence initial={false}>
      {candidateId !== null ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 pb-4 pt-0 md:px-6 md:pb-6 md:pt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={panelTransition}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-[calc(100vh-2rem)] w-full max-w-[72rem] flex-col overflow-hidden rounded-[30px] border border-border/80 bg-background shadow-[0_32px_100px_-36px_rgba(15,23,42,0.58)] md:max-h-[calc(100vh-3rem)]"
            initial={{ opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={panelTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-border/80 bg-muted/30 px-5 py-4 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Candidate Profile
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-xl font-semibold">
                      {candidate?.name ?? "Candidate"}
                    </h2>
                    {candidate?.role ? (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <Briefcase className="h-3.5 w-3.5" />
                          {candidate.role}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-6 md:py-6">
              <CandidateFullProfileContent id={candidateId} compact />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
