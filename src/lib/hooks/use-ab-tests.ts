"use client";

import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection } from "./use-firestore-subscription";
import { where } from "@/lib/firebase/firestore";

interface AbTest {
  id: string;
  orgId: string;
  jobId: string;
  name: string;
  status: "active" | "completed" | "draft";
  versionA: AbTestVersion;
  versionB: AbTestVersion;
  createdAt: { toDate: () => Date };
  updatedAt: { toDate: () => Date };
}

interface AbTestVersion {
  title: string;
  hook: string;
  impressions: number;
  scrollStopRate: number;
  expandRate: number;
  applyRate: number;
  costPerApplicant: number;
}

export function useAbTests(jobId?: string) {
  const { orgId } = useAuth();

  const constraints = orgId
    ? jobId
      ? [where("orgId", "==", orgId), where("jobId", "==", jobId)]
      : [where("orgId", "==", orgId)]
    : [];

  return useFirestoreCollection<AbTest>({
    queryKey: ["ab_tests", orgId, jobId ?? "all"],
    collectionPath: "ab_tests",
    constraints,
    enabled: !!orgId,
  });
}

export type { AbTest, AbTestVersion };
