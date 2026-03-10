"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { premiumEase } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import type { ShiftType } from "@/lib/firebase/types";

// ─── Types ────────────────────────────────────────────────────

type Step = "form" | "loading" | "result";

interface GeneratedResult {
  readonly [field: string]: string;
}

interface AIGenerateModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onApply: (result: GeneratedResult, acceptedFields: readonly string[]) => void;
}

// ─── Constants ────────────────────────────────────────────────

const TRADE_CATEGORIES = [
  "Warehouse & Logistics",
  "Construction",
  "Manufacturing",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Welding & Fabrication",
  "Food Service",
  "Driving & CDL",
  "Healthcare Aide",
  "Retail",
  "Cleaning & Janitorial",
  "Landscaping",
  "General Labor",
] as const;

const SHIFT_OPTIONS: { value: ShiftType; label: string }[] = [
  { value: "day", label: "Day Shift" },
  { value: "night", label: "Night Shift" },
  { value: "swing", label: "Swing Shift" },
  { value: "rotating", label: "Rotating" },
  { value: "flexible", label: "Flexible" },
];

const EXPERIENCE_OPTIONS = [
  { value: "0", label: "No experience needed" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "5", label: "5+ years" },
] as const;

const RESULT_FIELDS = [
  { key: "title", label: "Job Title" },
  { key: "description", label: "Description" },
  { key: "requirements", label: "Requirements" },
  { key: "benefits", label: "Benefits" },
  { key: "shiftSchedule", label: "Shift Schedule" },
  { key: "hourlyPayMin", label: "Min Pay ($/hr)" },
  { key: "hourlyPayMax", label: "Max Pay ($/hr)" },
] as const;

const SKELETON_HEIGHTS = ["h-6 w-3/4", "h-4 w-full", "h-20 w-full", "h-12 w-full", "h-8 w-2/3"];

// ─── Component ────────────────────────────────────────────────

export function AIGenerateModal({ isOpen, onClose, onApply }: AIGenerateModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [title, setTitle] = useState("");
  const [tradeCategory, setTradeCategory] = useState("");
  const [shiftType, setShiftType] = useState<ShiftType | "">("");
  const [location, setLocation] = useState("");
  const [experienceYears, setExperienceYears] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [accepted, setAccepted] = useState<ReadonlySet<string>>(new Set(RESULT_FIELDS.map((f) => f.key)));

  const resetState = useCallback(() => {
    setStep("form");
    setTitle("");
    setTradeCategory("");
    setShiftType("");
    setLocation("");
    setExperienceYears("0");
    setError(null);
    setResult(null);
    setAccepted(new Set(RESULT_FIELDS.map((f) => f.key)));
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleGenerate = useCallback(() => {
    if (!title.trim()) {
      setError("Job title is required");
      return;
    }
    if (!tradeCategory) {
      setError("Please select a trade category");
      return;
    }
    setError(null);
    setStep("loading");

    // Simulate AI generation (will be replaced with real Firebase call)
    setTimeout(() => {
      setResult({
        title: title.trim(),
        description: `We're hiring a ${title.trim()}${location ? ` in ${location}` : ""}. ${shiftType ? `This is a ${shiftType} shift position. ` : ""}Start right away and join a solid team.\n\nWhat you'll do:\n• Perform daily tasks safely and efficiently\n• Follow all safety protocols and procedures\n• Work with your team to meet daily goals\n• Keep your work area clean and organized`,
        requirements: experienceYears === "0"
          ? "No experience needed, will train the right person"
          : `${experienceYears}+ years of experience in ${tradeCategory.toLowerCase()}`,
        benefits: "Weekly pay, overtime available, health insurance after 90 days, PPE provided",
        shiftSchedule: shiftType
          ? `${shiftType.charAt(0).toUpperCase() + shiftType.slice(1)} shift, Mon-Fri`
          : "Monday through Friday",
        hourlyPayMin: "18",
        hourlyPayMax: "28",
      });
      setAccepted(new Set(RESULT_FIELDS.map((f) => f.key)));
      setStep("result");
    }, 2000);
  }, [title, tradeCategory, shiftType, location, experienceYears]);

  const toggleField = useCallback((field: string) => {
    setAccepted((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  }, []);

  const handleApplySelected = useCallback(() => {
    if (!result) return;
    const acceptedArr = [...accepted];
    onApply(result, acceptedArr);
    handleClose();
  }, [result, accepted, onApply, handleClose]);

  const handleApplyAll = useCallback(() => {
    if (!result) return;
    onApply(result, RESULT_FIELDS.map((f) => f.key));
    handleClose();
  }, [result, onApply, handleClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[10px] border border-border bg-card shadow-soft"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.24, ease: premiumEase }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-semibold text-foreground">Generate Job with AI</h3>
              <button
                onClick={handleClose}
                className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto p-5">
              {/* Form Step */}
              {step === "form" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ai-title">Job Title *</Label>
                    <Input
                      id="ai-title"
                      className="mt-1.5"
                      placeholder="e.g. Forklift Operator, Electrician, Line Cook"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ai-trade">Trade Category *</Label>
                    <select
                      id="ai-trade"
                      className="mt-1.5 h-10 w-full rounded-md border border-input bg-input-background px-3 text-sm text-foreground"
                      value={tradeCategory}
                      onChange={(e) => setTradeCategory(e.target.value)}
                    >
                      <option value="">Select trade...</option>
                      {TRADE_CATEGORIES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="ai-shift">Shift Type</Label>
                      <select
                        id="ai-shift"
                        className="mt-1.5 h-10 w-full rounded-md border border-input bg-input-background px-3 text-sm text-foreground"
                        value={shiftType}
                        onChange={(e) => setShiftType(e.target.value as ShiftType | "")}
                      >
                        <option value="">Any shift</option>
                        {SHIFT_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="ai-experience">Experience</Label>
                      <select
                        id="ai-experience"
                        className="mt-1.5 h-10 w-full rounded-md border border-input bg-input-background px-3 text-sm text-foreground"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                      >
                        {EXPERIENCE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ai-location">Location</Label>
                    <Input
                      id="ai-location"
                      className="mt-1.5"
                      placeholder="e.g. Houston, TX or Dallas warehouse district"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-md bg-danger/10 px-3 py-2 text-xs text-danger">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {error}
                    </div>
                  )}
                </div>
              )}

              {/* Loading Step */}
              {step === "loading" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Generating job posting...</p>
                  {SKELETON_HEIGHTS.map((h, i) => (
                    <div
                      key={i}
                      className={cn(
                        "animate-pulse rounded-md bg-muted",
                        h
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Result Step */}
              {step === "result" && result && (
                <div className="space-y-3">
                  {RESULT_FIELDS.map(({ key, label }) => {
                    const isAccepted = accepted.has(key);
                    const value = result[key] ?? "";

                    return (
                      <label
                        key={key}
                        className={cn(
                          "flex cursor-pointer gap-3 rounded-md border p-3 transition-colors",
                          isAccepted
                            ? "border-lynq-accent/30 bg-lynq-accent-muted"
                            : "border-border bg-card"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isAccepted}
                          onChange={() => toggleField(key)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--lynq-accent))]"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-muted-foreground">{label}</span>
                          <p className="mt-0.5 whitespace-pre-line text-sm text-foreground line-clamp-4">{value}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-5 py-4">
              {step === "form" && (
                <>
                  <Button variant="outline" size="sm" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleGenerate}>
                    Generate
                  </Button>
                </>
              )}

              {step === "loading" && (
                <p className="text-xs text-muted-foreground">This may take a few seconds...</p>
              )}

              {step === "result" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep("form")}
                    className="gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplySelected}
                      disabled={accepted.size === 0}
                    >
                      Apply Selected ({accepted.size})
                    </Button>
                    <Button size="sm" onClick={handleApplyAll}>
                      Apply All
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
