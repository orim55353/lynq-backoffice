"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { httpsCallable } from "firebase/functions";
import { getFirebaseFunctions } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth-context";
import { computeLocalScore } from "@/lib/utils/job-scoring";
import type { Job } from "@/lib/firebase/types";

// ─── Types ────────────────────────────────────────────────────

export interface ScoreState {
  readonly score: number;
  readonly breakdown: {
    readonly payTransparency: number;
    readonly shiftClarity: number;
    readonly requirementsClarity: number;
    readonly locationLogistics: number;
    readonly readability: number;
  };
  readonly suggestions: ReadonlyArray<{
    readonly field: string;
    readonly message: string;
    readonly impact: "high" | "medium" | "low";
  }>;
  readonly aiLoading: boolean;
  readonly localReady: boolean;
}

export interface BiasIssue {
  readonly text: string;
  readonly type: "age" | "gender" | "education" | "physical" | "immigration" | "overqualification";
  readonly suggestion: string;
  readonly severity: "high" | "medium" | "low";
}

export interface BiasState {
  readonly issues: readonly BiasIssue[];
  readonly loading: boolean;
}

// ─── Constants ────────────────────────────────────────────────

const AI_DEBOUNCE_MS = 800;
const BIAS_DEBOUNCE_MS = 800;
const BIAS_MIN_CHANGE_CHARS = 10;

// ─── useJobScore ──────────────────────────────────────────────

export function useJobScore(job: Partial<Job>): ScoreState {
  const { orgId } = useAuth();
  const [aiReadability, setAiReadability] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<ScoreState["suggestions"]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [hasSettled, setHasSettled] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute local score synchronously
  const localResult = computeLocalScore({
    title: job.title,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    skills: job.skills,
    location: job.location,
    payType: job.payType,
    hourlyPayMin: job.hourlyPayMin,
    hourlyPayMax: job.hourlyPayMax,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    overtimeRate: job.overtimeRate,
    payFrequency: job.payFrequency,
    shiftType: job.shiftType,
    shiftSchedule: job.shiftSchedule,
    startDate: job.startDate,
    physicalRequirements: job.physicalRequirements,
    certifications: job.certifications,
    experienceYears: job.experienceYears,
    transportRequired: job.transportRequired,
  });

  // The local score already computes readability from text.
  // AI can enhance the readability score. Blend: local readability 60% + AI 40%.
  const blendedReadability = aiReadability > 0
    ? Math.round(localResult.readability * 0.6 + aiReadability * 0.4)
    : localResult.readability;

  // Recompute total with blended readability
  const score = Math.round(
    localResult.payTransparency * 0.30 +
    localResult.shiftClarity * 0.25 +
    localResult.requirementsClarity * 0.20 +
    localResult.locationLogistics * 0.15 +
    blendedReadability * 0.10,
  );

  const breakdown = {
    payTransparency: localResult.payTransparency,
    shiftClarity: localResult.shiftClarity,
    requirementsClarity: localResult.requirementsClarity,
    locationLogistics: localResult.locationLogistics,
    readability: blendedReadability,
  };

  // Debounced AI scoring (only for readability + suggestions)
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      const hasContent = Boolean(job.title?.trim() || job.description?.trim());
      if (!orgId || !hasContent) {
        setAiReadability(0);
        setAiSuggestions([]);
        setHasSettled(true);
        return;
      }

      setAiLoading(true);
      try {
        const scoreJob = httpsCallable<
          { job: Partial<Job>; orgId: string },
          { readability: number; suggestions: ScoreState["suggestions"] }
        >(getFirebaseFunctions(), "scoreJob");

        const response = await scoreJob({ job, orgId });
        const data = response.data;

        setAiReadability(data.readability);
        setAiSuggestions(data.suggestions);
      } catch {
        setAiReadability(0);
        setAiSuggestions([]);
      } finally {
        setAiLoading(false);
        setHasSettled(true);
      }
    }, AI_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    job.title,
    job.description,
    job.hourlyPayMin,
    job.hourlyPayMax,
    job.shiftType,
    job.shiftSchedule,
    job.physicalRequirements?.length,
    job.certifications?.length,
    job.location,
    orgId,
  ]);

  return {
    score,
    breakdown,
    suggestions: aiSuggestions,
    aiLoading,
    localReady: hasSettled,
  };
}

// ─── useDetectBias ────────────────────────────────────────────

export function useDetectBias(text: string): BiasState {
  const { orgId } = useAuth();
  const [issues, setIssues] = useState<readonly BiasIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTextRef = useRef(text);

  const fetchBias = useCallback(
    async (inputText: string) => {
      if (!orgId || !inputText.trim()) {
        setIssues([]);
        return;
      }

      setLoading(true);
      try {
        const detectBias = httpsCallable<
          { text: string; orgId: string },
          { issues: readonly BiasIssue[] }
        >(getFirebaseFunctions(), "detectBias");

        const response = await detectBias({ text: inputText, orgId });
        setIssues(response.data.issues);
      } catch {
        setIssues([]);
      } finally {
        setLoading(false);
      }
    },
    [orgId],
  );

  useEffect(() => {
    const charDiff = Math.abs(text.length - prevTextRef.current.length);
    if (charDiff < BIAS_MIN_CHANGE_CHARS && prevTextRef.current !== "") {
      return;
    }
    prevTextRef.current = text;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      fetchBias(text);
    }, BIAS_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [text, fetchBias]);

  return { issues, loading };
}
