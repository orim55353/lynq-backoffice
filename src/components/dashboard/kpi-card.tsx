"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { MotionCard } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface KpiCardProps {
  title: string;
  value: string | number;
  change: number;
  sparklineData?: number[];
  format?: "number" | "currency" | "percentage" | "time";
}

export function KpiCard({
  title,
  value,
  change,
  sparklineData,
  format = "number",
}: KpiCardProps) {
  const isPositive = change >= 0;

  const formatValue = (raw: string | number) => {
    if (typeof raw === "string") {
      return raw;
    }

    if (format === "currency") {
      return `$${raw.toLocaleString()}`;
    }

    if (format === "percentage") {
      return `${raw}%`;
    }

    if (format === "time") {
      return `${raw} days`;
    }

    return raw.toLocaleString();
  };

  return (
    <MotionCard interactive className="rounded-[22px] border-border border-t-2 border-t-lynq-accent bg-card p-4 shadow-soft">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold tracking-tight">
            {formatValue(value)}
          </h3>
        </div>
        <div
          className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${
            isPositive
              ? "bg-success/10 text-success"
              : "bg-danger/10 text-danger"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>

      {sparklineData ? (
        <div className="-mx-1 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sparklineData.map((point, index) => ({ index, point }))}
            >
              <Line
                type="monotone"
                dataKey="point"
                stroke={isPositive ? "var(--success)" : "var(--danger)"}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </MotionCard>
  );
}
