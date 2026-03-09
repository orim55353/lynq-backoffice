"use client";

import { useEffect } from "react";
import { useQueryClient, useQuery, type QueryKey } from "@tanstack/react-query";
import {
  subscribeToCollection,
  subscribeToDocument,
  type QueryConstraint,
} from "@/lib/firebase/firestore";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UseFirestoreCollectionOptions<T> {
  queryKey: QueryKey;
  collectionPath: string;
  constraints?: QueryConstraint[];
  enabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UseFirestoreDocumentOptions<T> {
  queryKey: QueryKey;
  collectionPath: string;
  documentId: string;
  enabled?: boolean;
}

export function useFirestoreCollection<T>({
  queryKey,
  collectionPath,
  constraints = [],
  enabled = true,
}: UseFirestoreCollectionOptions<T>) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = subscribeToCollection<T>(
      collectionPath,
      constraints,
      (items) => {
        queryClient.setQueryData(queryKey, items);
      }
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, collectionPath, JSON.stringify(constraints)]);

  return useQuery<T[]>({
    queryKey,
    queryFn: () => {
      const cached = queryClient.getQueryData<T[]>(queryKey);
      if (cached !== undefined) return cached;
      // Keep query in loading state until the Firestore subscription delivers data
      return new Promise<T[]>(() => {});
    },
    enabled,
    staleTime: Infinity,
  });
}

export function useFirestoreDocument<T>({
  queryKey,
  collectionPath,
  documentId,
  enabled = true,
}: UseFirestoreDocumentOptions<T>) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !documentId) return;

    const unsubscribe = subscribeToDocument<T>(
      collectionPath,
      documentId,
      (item) => {
        queryClient.setQueryData(queryKey, item);
      }
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, collectionPath, documentId]);

  return useQuery<T | null>({
    queryKey,
    queryFn: () => {
      const cached = queryClient.getQueryData<T | null>(queryKey);
      if (cached !== undefined) return cached;
      return new Promise<T | null>(() => {});
    },
    enabled,
    staleTime: Infinity,
  });
}
