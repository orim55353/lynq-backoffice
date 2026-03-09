"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection, useFirestoreDocument } from "./use-firestore-subscription";
import { createDocument, updateDocument, where } from "@/lib/firebase/firestore";
import type { Job } from "@/lib/firebase/types";

export function useJobs() {
  const { orgId } = useAuth();

  return useFirestoreCollection<Job>({
    queryKey: ["jobs", orgId],
    collectionPath: "jobs",
    constraints: orgId ? [where("orgId", "==", orgId)] : [],
    enabled: !!orgId,
  });
}

export function useJob(jobId: string | undefined) {
  return useFirestoreDocument<Job>({
    queryKey: ["job", jobId],
    collectionPath: "jobs",
    documentId: jobId ?? "",
    enabled: !!jobId,
  });
}

export function useCreateJob() {
  const { orgId, user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Job, "id" | "createdAt" | "updatedAt" | "orgId" | "createdBy" | "viewCount" | "applicationCount">) => {
      if (!orgId || !user) throw new Error("No organization or user");
      const id = `job-${Date.now()}`;
      await createDocument("jobs", id, {
        ...data,
        orgId,
        createdBy: user.uid,
        viewCount: 0,
        applicationCount: 0,
      });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", orgId] });
    },
  });
}

export function useUpdateJob() {
  const { orgId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Job> }) => {
      await updateDocument("jobs", id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", orgId] });
    },
  });
}
