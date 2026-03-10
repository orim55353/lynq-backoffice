"use client";

import { useState, useCallback } from "react";
import { httpsCallable } from "firebase/functions";
import { getFirebaseFunctions } from "@/lib/firebase/config";
import { useAuth } from "@/lib/auth-context";
import type {
  GenerateJobInput,
  GenerateJobResult,
  OptimizeFieldInput,
  OptimizeFieldResult,
  AIFieldName,
  GenerationState,
  FieldOptimizationState,
} from "@/lib/ai/types";

// ─── Initial States ───────────────────────────────────────────

const INITIAL_GENERATION_STATE: GenerationState = {
  status: "idle",
  result: null,
  error: null,
};

const INITIAL_FIELD_STATE: FieldOptimizationState = {
  field: "title",
  status: "idle",
  result: null,
  error: null,
};

// ─── useGenerateJob ───────────────────────────────────────────

export function useGenerateJob() {
  const { orgId } = useAuth();
  const [state, setState] = useState<GenerationState>(INITIAL_GENERATION_STATE);

  const generate = useCallback(
    async (input: GenerateJobInput): Promise<GenerateJobResult | null> => {
      if (!orgId) {
        setState({ status: "error", result: null, error: "No organization selected" });
        return null;
      }

      setState({ status: "loading", result: null, error: null });

      try {
        const generateJob = httpsCallable<
          GenerateJobInput & { orgId: string },
          GenerateJobResult
        >(getFirebaseFunctions(), "generateJob");

        const response = await generateJob({ ...input, orgId });
        const result = response.data;

        setState({ status: "success", result, error: null });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to generate job";
        setState({ status: "error", result: null, error: message });
        return null;
      }
    },
    [orgId],
  );

  const reset = useCallback(() => {
    setState(INITIAL_GENERATION_STATE);
  }, []);

  return { state, generate, reset } as const;
}

// ─── useOptimizeField ─────────────────────────────────────────

export function useOptimizeField() {
  const { orgId } = useAuth();
  const [fieldStates, setFieldStates] = useState<
    Readonly<Record<AIFieldName, FieldOptimizationState>>
  >({
    title: { ...INITIAL_FIELD_STATE, field: "title" },
    description: { ...INITIAL_FIELD_STATE, field: "description" },
    requirements: { ...INITIAL_FIELD_STATE, field: "requirements" },
    benefits: { ...INITIAL_FIELD_STATE, field: "benefits" },
    skills: { ...INITIAL_FIELD_STATE, field: "skills" },
  });

  const optimize = useCallback(
    async (input: OptimizeFieldInput): Promise<OptimizeFieldResult | null> => {
      if (!orgId) return null;

      const { field } = input;

      setFieldStates((prev) => ({
        ...prev,
        [field]: { field, status: "loading" as const, result: null, error: null },
      }));

      try {
        const optimizeField = httpsCallable<
          OptimizeFieldInput & { orgId: string },
          OptimizeFieldResult
        >(getFirebaseFunctions(), "optimizeField");

        const response = await optimizeField({ ...input, orgId });
        const result = response.data;

        setFieldStates((prev) => ({
          ...prev,
          [field]: { field, status: "success" as const, result, error: null },
        }));

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Optimization failed";
        setFieldStates((prev) => ({
          ...prev,
          [field]: { field, status: "error" as const, result: null, error: message },
        }));
        return null;
      }
    },
    [orgId],
  );

  const dismissField = useCallback((field: AIFieldName) => {
    setFieldStates((prev) => ({
      ...prev,
      [field]: { field, status: "idle" as const, result: null, error: null },
    }));
  }, []);

  const getFieldState = useCallback(
    (field: AIFieldName): FieldOptimizationState => fieldStates[field],
    [fieldStates],
  );

  return { optimize, dismissField, getFieldState } as const;
}
