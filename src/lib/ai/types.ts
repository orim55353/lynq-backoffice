// ─── AI Service Types (Blue-Collar) ───────────────────────────
// Shared between frontend hooks and Firebase Functions.

import type { ShiftType } from "@/lib/firebase/types";

// ─── Generate Job ──────────────────────────────────────────────

export interface GenerateJobInput {
  readonly title: string;
  readonly department: string;
  readonly location: string;
  readonly shiftType: ShiftType;
  readonly experienceYears: number;
  readonly tradeCategory: string;
}

export interface GenerateJobResult {
  readonly title: string;
  readonly description: string;
  readonly requirements: readonly string[];
  readonly physicalRequirements: readonly string[];
  readonly certifications: readonly string[];
  readonly benefits: readonly string[];
  readonly skills: readonly string[];
  readonly hourlyPayRange: { readonly min: number; readonly max: number; readonly currency: string };
  readonly shiftSchedule: string;
  readonly experienceYears: number;
}

// ─── Optimize Field ────────────────────────────────────────────

export type AIFieldName = "title" | "description" | "requirements" | "benefits" | "skills";

export interface OptimizeFieldInput {
  readonly field: AIFieldName;
  readonly currentValue: string;
  readonly context: Record<string, unknown>;
}

export interface OptimizeFieldResult {
  readonly optimizedValue: string;
  readonly reasoning: string;
  readonly confidenceScore: number;
}

// ─── Score Job ─────────────────────────────────────────────────

export interface ScoreJobResult {
  readonly readability: number;
  readonly suggestions: ReadonlyArray<{
    readonly field: string;
    readonly message: string;
    readonly impact: "high" | "medium" | "low";
  }>;
}

// ─── Detect Bias ───────────────────────────────────────────────

export interface BiasIssue {
  readonly text: string;
  readonly type: "age" | "gender" | "education" | "physical" | "immigration" | "overqualification";
  readonly suggestion: string;
  readonly severity: "high" | "medium" | "low";
  readonly position?: number;
}

export interface DetectBiasResult {
  readonly issues: readonly BiasIssue[];
}

// ─── Hook State Types ──────────────────────────────────────────

export interface GenerationState {
  readonly status: "idle" | "loading" | "success" | "error";
  readonly result: GenerateJobResult | null;
  readonly error: string | null;
}

export interface FieldOptimizationState {
  readonly field: AIFieldName;
  readonly status: "idle" | "loading" | "success" | "error";
  readonly result: OptimizeFieldResult | null;
  readonly error: string | null;
}
