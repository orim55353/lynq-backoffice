"use client";

import { useAuth } from "@/lib/auth-context";
import { useFirestoreDocument } from "./use-firestore-subscription";
import type { BillingRecord } from "@/lib/firebase/types";

export function useBilling() {
  const { orgId } = useAuth();

  return useFirestoreDocument<BillingRecord>({
    queryKey: ["billing", orgId],
    collectionPath: "billing",
    documentId: orgId ?? "",
    enabled: !!orgId,
  });
}
