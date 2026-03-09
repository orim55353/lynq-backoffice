"use client";

import { Button } from "@/components/ui/button";
import { useChartTheme } from "@/lib/chart-theme";
import {
  BenchmarkSummary,
  ConversionFunnelCard,
  DwellTimeAndSourceBreakdown,
  TrafficAndApplyTrend
} from "@/components/screens/analytics/analytics-sections";

export function AnalyticsScreen() {
  const chart = useChartTheme();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1">Analytics</h1>
          <p className="text-sm text-muted-foreground">Deep insights into your hiring performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm">
            Last 30 Days
          </Button>
          <Button variant="outline" className="text-sm">
            Export Report
          </Button>
        </div>
      </div>

      <ConversionFunnelCard />
      <TrafficAndApplyTrend chart={chart} />
      <DwellTimeAndSourceBreakdown chart={chart} />
      <BenchmarkSummary />
    </div>
  );
}
