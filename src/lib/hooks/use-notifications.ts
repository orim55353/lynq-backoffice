"use client";

import { useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection } from "./use-firestore-subscription";
import { where, orderBy, limit, updateDocument } from "@/lib/firebase/firestore";
import type { Notification } from "@/lib/firebase/types";

interface UseNotificationsOptions {
  enabled?: boolean;
}

export function useNotifications({ enabled = true }: UseNotificationsOptions = {}) {
  const { user } = useAuth();

  const result = useFirestoreCollection<Notification>({
    queryKey: ["notifications", user?.uid],
    collectionPath: "notifications",
    constraints: user ? [where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(20)] : [],
    enabled: !!user && enabled,
  });

  const unreadCount = result.data?.filter((n) => !n.read).length ?? 0;

  const markAsRead = useCallback(async (notificationId: string) => {
    await updateDocument("notifications", notificationId, { read: true });
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = result.data?.filter((n) => !n.read) ?? [];
    await Promise.all(unread.map((n) => updateDocument("notifications", n.id, { read: true })));
  }, [result.data]);

  return { ...result, unreadCount, markAsRead, markAllAsRead };
}
