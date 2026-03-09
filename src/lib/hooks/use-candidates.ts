"use client";

import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection, useFirestoreDocument } from "./use-firestore-subscription";
import { where } from "@/lib/firebase/firestore";
import type { Candidate } from "@/lib/firebase/types";

export function useCandidates() {
  const { orgId } = useAuth();

  return useFirestoreCollection<Candidate>({
    queryKey: ["candidates", orgId],
    collectionPath: "candidates",
    constraints: orgId ? [where("orgId", "==", orgId)] : [],
    enabled: !!orgId,
  });
}

export function useCandidate(candidateId: string | undefined) {
  return useFirestoreDocument<Candidate>({
    queryKey: ["candidate", candidateId],
    collectionPath: "candidates",
    documentId: candidateId ?? "",
    enabled: !!candidateId,
  });
}
