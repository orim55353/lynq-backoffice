"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  FileText,
  Calendar,
  MessageSquare,
  Rocket,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { panelTransition, premiumEase } from "@/components/ui/motion";
import { useNotifications } from "@/lib/hooks/use-notifications";
import type { NotificationType } from "@/lib/firebase/types";
import type { Timestamp } from "firebase/firestore";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  new_application: { icon: FileText, color: "text-info" },
  interview_reminder: { icon: Calendar, color: "text-warning" },
  offer_response: { icon: MessageSquare, color: "text-success" },
  campaign_update: { icon: Rocket, color: "text-chart-4" },
  system: { icon: Info, color: "text-muted-foreground" },
};

const fallbackRoutes: Record<NotificationType, string> = {
  new_application: "/candidates",
  interview_reminder: "/candidates",
  offer_response: "/candidates",
  campaign_update: "/sponsored",
  system: "/",
};

function getNotificationRoute(notification: { type: NotificationType; actionURL: string | null }): string {
  return notification.actionURL ?? fallbackRoutes[notification.type] ?? "/";
}

function formatTime(timestamp: Timestamp | undefined): string {
  if (!timestamp?.toDate) return "";
  const date = timestamp.toDate();
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const { data: notifications, isLoading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <div className="fixed inset-0 top-[57px] z-40" onClick={onClose} />
          <motion.div
            ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={panelTransition}
          className="absolute right-0 top-full z-50 mt-2 w-[380px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_64px_-24px_rgba(0,0,0,0.35)]"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 ? (
                <Badge className="border-0 bg-danger/10 px-1.5 py-0 text-[10px] text-danger">
                  {unreadCount}
                </Badge>
              ) : null}
            </div>
            {unreadCount > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            ) : null}
          </div>

          <div className="max-h-[420px] overflow-y-auto overscroll-contain">
            {isLoading ? (
              <div className="space-y-1 p-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl bg-muted/50 p-3">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 rounded bg-muted" />
                        <div className="h-2.5 w-full rounded bg-muted" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !notifications?.length ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <BellOff className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-0.5 p-1.5">
                {notifications.map((notification, index) => {
                  const config = typeConfig[notification.type] ?? typeConfig.system;
                  const Icon = config.icon;

                  return (
                    <motion.button
                      key={notification.id}
                      type="button"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.18, ease: premiumEase }}
                      onClick={() => {
                        if (!notification.read) markAsRead(notification.id);
                        router.push(getNotificationRoute(notification));
                        onClose();
                      }}
                      className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 hover:bg-muted/60 ${
                        !notification.read ? "bg-info/[0.04]" : ""
                      }`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-snug ${!notification.read ? "font-medium" : "text-muted-foreground"}`}>
                            {notification.title}
                          </p>
                          {!notification.read ? (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-info" />
                          ) : (
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40 opacity-0 group-hover:opacity-100" />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/60">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
