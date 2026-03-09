"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection, useFirestoreDocument } from "./use-firestore-subscription";
import { createDocument, where } from "@/lib/firebase/firestore";
import type { Campaign } from "@/lib/firebase/types";

export function useCampaigns() {
  const { orgId } = useAuth();

  return useFirestoreCollection<Campaign>({
    queryKey: ["campaigns", orgId],
    collectionPath: "campaigns",
    constraints: orgId ? [where("orgId", "==", orgId)] : [],
    enabled: !!orgId,
  });
}

export function useCampaign(campaignId: string | undefined) {
  return useFirestoreDocument<Campaign>({
    queryKey: ["campaign", campaignId],
    collectionPath: "campaigns",
    documentId: campaignId ?? "",
    enabled: !!campaignId,
  });
}

export function useCreateCampaign() {
  const { orgId, user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Campaign, "id" | "createdAt" | "updatedAt" | "orgId" | "createdBy">) => {
      if (!orgId || !user) throw new Error("No organization or user");
      const id = `campaign-${Date.now()}`;
      await createDocument("campaigns", id, {
        ...data,
        orgId,
        createdBy: user.uid,
      });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", orgId] });
    },
  });
}
