"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection } from "./use-firestore-subscription";
import { updateDocument, where } from "@/lib/firebase/firestore";
import type { Application } from "@/lib/firebase/types";

export function useApplications(jobId?: string) {
  const { orgId } = useAuth();

  const constraints = orgId
    ? jobId
      ? [where("orgId", "==", orgId), where("jobId", "==", jobId)]
      : [where("orgId", "==", orgId)]
    : [];

  return useFirestoreCollection<Application>({
    queryKey: ["applications", orgId, jobId ?? "all"],
    collectionPath: "applications",
    constraints,
    enabled: !!orgId,
  });
}

export function useUpdateApplication() {
  const { orgId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Application> }) => {
      await updateDocument("applications", id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", orgId] });
    },
  });
}
