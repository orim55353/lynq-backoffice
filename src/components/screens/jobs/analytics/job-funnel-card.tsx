"use client";

import { motion } from "framer-motion";
import { MotionCard } from "@/components/ui/card";
import { premiumEase } from "@/components/ui/motion";

export interface FunnelData {
  readonly impressions: number;
  readonly scrollStops: number;
  readonly expands: number;
  readonly applies: number;
  readonly scrollStopRate: number;
  readonly expandRate: number;
  readonly applyRate: number;
}

interface JobFunnelCardProps {
  readonly funnel: FunnelData;
  readonly jobTitle: string;
}

const stages = [
  { key: "impressions", label: "Impressions", rateKey: null },
  { key: "scrollStops", label: "Scroll Stops", rateKey: "scrollStopRate" },
  { key: "expands", label: "Expands", rateKey: "expandRate" },
  { key: "applies", label: "Applies", rateKey: "applyRate" },
] as const;

const barColors = [
  "bg-muted-foreground/40",
  "bg-chart-1/60",
  "bg-chart-1/80",
  "bg-[hsl(var(--lynq-accent-hover))]",
];

export function JobFunnelCard({ funnel, jobTitle }: JobFunnelCardProps) {
  const max = funnel.impressions || 1;

  return (
    <MotionCard className="rounded-[22px] border-border bg-card p-5 shadow-soft">
      <h3 className="mb-1 text-lg font-semibold">Conversion Funnel</h3>
      <p className="mb-5 text-sm text-muted-foreground">{jobTitle}</p>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const count = funnel[stage.key] as number;
          const rate = stage.rateKey ? (funnel[stage.rateKey] as number) : null;
          const widthPercent = Math.max((count / max) * 100, 8);

          return (
            <div key={stage.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{stage.label}</span>
                <span className="text-muted-foreground">
                  {count.toLocaleString()}
                  {rate != null ? ` · ${rate}%` : ""}
                </span>
              </div>
              <motion.div
                className={`h-7 rounded-md ${barColors[index]}`}
                initial={{ width: 0 }}
                animate={{ width: `${widthPercent}%` }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: premiumEase as unknown as [number, number, number, number],
                }}
              />
            </div>
          );
        })}
      </div>
    </MotionCard>
  );
}
