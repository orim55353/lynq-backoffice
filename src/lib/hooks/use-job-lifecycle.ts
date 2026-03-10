"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDocument } from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { validateTransition, type JobStatus } from "@/lib/utils/job-lifecycle";
import { Timestamp } from "firebase/firestore";
import type { Job } from "@/lib/firebase/types";

// ─── Types ────────────────────────────────────────────────────

interface TransitionInput {
  readonly jobId: string;
  readonly job: Pick<Job, "status" | "title" | "description" | "qualityScore">;
  readonly targetStatus: JobStatus;
  readonly closedReason?: string;
}

interface ScheduleInput {
  readonly jobId: string;
  readonly scheduledPublishAt?: Date;
  readonly closesAt?: Date;
}

// ─── useTransitionJob ─────────────────────────────────────────

export function useTransitionJob() {
  const { orgId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TransitionInput) => {
      const { jobId, job, targetStatus, closedReason } = input;

      // Validate the transition before executing
      const validation = validateTransition(
        {
          status: job.status,
          title: job.title,
          description: job.description,
          qualityScore: job.qualityScore,
        },
        targetStatus,
      );

      if (!validation.valid) {
        throw new Error(validation.reason ?? "Invalid status transition");
      }

      // Build the update payload immutably
      const updateData: Record<string, unknown> = {
        status: targetStatus,
      };

      // Draft → Active: set publishedAt
      if (job.status === "draft" && targetStatus === "active") {
        updateData.publishedAt = Timestamp.now();
      }

      // Any → Closed: set closedAt and closedReason
      if (targetStatus === "closed") {
        updateData.closedAt = Timestamp.now();
        if (closedReason) {
          updateData.closedReason = closedReason;
        }
      }

      await updateDocument("jobs", jobId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", orgId] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
  });
}

// ─── useScheduleJob ───────────────────────────────────────────

export function useScheduleJob() {
  const { orgId } = useAuth();
  const queryClient = useQueryClient();

  const validateDates = useCallback(
    (input: ScheduleInput): string | null => {
      const now = new Date();

      if (input.scheduledPublishAt && input.scheduledPublishAt <= now) {
        return "Scheduled publish date must be in the future";
      }

      if (input.closesAt && input.closesAt <= now) {
        return "Close date must be in the future";
      }

      if (
        input.scheduledPublishAt &&
        input.closesAt &&
        input.closesAt <= input.scheduledPublishAt
      ) {
        return "Close date must be after the scheduled publish date";
      }

      return null;
    },
    [],
  );

  return useMutation({
    mutationFn: async (input: ScheduleInput) => {
      const { jobId, scheduledPublishAt, closesAt } = input;

      const validationError = validateDates(input);
      if (validationError) {
        throw new Error(validationError);
      }

      const updateData: Record<string, unknown> = {};

      if (scheduledPublishAt) {
        updateData.scheduledPublishAt = Timestamp.fromDate(scheduledPublishAt);
      }

      if (closesAt) {
        updateData.closesAt = Timestamp.fromDate(closesAt);
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error("At least one date must be provided");
      }

      await updateDocument("jobs", jobId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", orgId] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
  });
}
