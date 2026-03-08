"use client";

import { useMemo, useState } from "react";
import { useChartTheme } from "@/lib/chart-theme";
import {
  CampaignBuilderCard,
  CampaignsTableCard,
  ForecastAndBenefitsCard,
  PerformanceChartCard
} from "@/components/screens/sponsored/sponsored-sections";

export function SponsoredScreen() {
  const [budget, setBudget] = useState(500);
  const [duration, setDuration] = useState(7);
  const chart = useChartTheme();

  const estimatedReach = useMemo(() => Math.floor(budget * 90 * (duration / 7)), [budget, duration]);
  const predictedApplies = useMemo(() => Math.max(1, Math.floor(estimatedReach * 0.045)), [estimatedReach]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1">Sponsored (Story Boost)</h1>
        <p className="text-sm text-muted-foreground">Boost your jobs to reach more candidates</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CampaignBuilderCard
          budget={budget}
          duration={duration}
          onBudgetChange={setBudget}
          onDurationChange={setDuration}
        />
        <ForecastAndBenefitsCard
          budget={budget}
          duration={duration}
          estimatedReach={estimatedReach}
          predictedApplies={predictedApplies}
        />
      </div>

      <CampaignsTableCard />
      <PerformanceChartCard chart={chart} />
    </div>
  );
}
