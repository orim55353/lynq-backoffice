"use client";

import Link from "next/link";
import {
  TrendingDown,
  AlertCircle,
  DollarSign,
  Users,
  Zap,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Recommendation {
  readonly id: string;
  readonly severity: "high" | "medium" | "low";
  readonly icon: string;
  readonly message: string;
  readonly action: string;
  readonly actionRoute?: string;
}

interface JobRecommendationsCardProps {
  readonly recommendations: readonly Recommendation[];
  readonly jobTitle: string;
}

const iconMap: Record<string, LucideIcon> = {
  "trending-down": TrendingDown,
  "alert-circle": AlertCircle,
  "dollar-sign": DollarSign,
  users: Users,
  zap: Zap,
};

const severityConfig: Record<string, { badge: string; border: string; label: string }> = {
  high: {
    badge: "border-0 bg-danger/10 text-danger",
    border: "border-danger/20",
    label: "High",
  },
  medium: {
    badge: "border-0 bg-warning/10 text-warning",
    border: "border-warning/20",
    label: "Medium",
  },
  low: {
    badge: "border-0 bg-info/10 text-info",
    border: "border-info/20",
    label: "Low",
  },
};

function EmptyRecommendations() {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <CheckCircle2 className="h-10 w-10 text-success" />
      <p className="text-sm font-medium text-success">No Issues Found</p>
      <p className="text-xs text-muted-foreground">This job is performing well across all metrics.</p>
    </div>
  );
}

export function JobRecommendationsCard({ recommendations, jobTitle }: JobRecommendationsCardProps) {
  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h3 className="mb-1 text-lg font-semibold">Recommendations</h3>
      <p className="mb-4 text-sm text-muted-foreground">{jobTitle}</p>

      {recommendations.length === 0 ? (
        <EmptyRecommendations />
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const config = severityConfig[rec.severity] ?? severityConfig.low;
            const Icon = iconMap[rec.icon] ?? AlertCircle;

            return (
              <div
                key={rec.id}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between",
                  config.border
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Badge className={config.badge}>{config.label}</Badge>
                    </div>
                    <p className="text-sm">{rec.message}</p>
                  </div>
                </div>
                {rec.actionRoute ? (
                  <Link href={rec.actionRoute}>
                    <Button variant="outline" size="sm" className="shrink-0">
                      {rec.action}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="shrink-0">
                    {rec.action}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </MotionCard>
  );
}
