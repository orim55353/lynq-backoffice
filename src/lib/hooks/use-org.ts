"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useFirestoreDocument } from "./use-firestore-subscription";
import { updateDocument } from "@/lib/firebase/firestore";
import type { Organization } from "@/lib/firebase/types";

export function useOrganization() {
  const { orgId } = useAuth();

  return useFirestoreDocument<Organization>({
    queryKey: ["organization", orgId],
    collectionPath: "organizations",
    documentId: orgId ?? "",
    enabled: !!orgId,
  });
}

export function useUpdateOrganization() {
  const { orgId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Organization>) => {
      if (!orgId) throw new Error("No organization");
      await updateDocument("organizations", orgId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
    },
  });
}
