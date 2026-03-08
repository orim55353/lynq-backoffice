"use client";

import { useChartTheme } from "@/lib/chart-theme";
import {
  BestPostingTimeCard,
  MarketInsightsHeader,
  RegionalDemandCard,
  SalaryBenchmarkCard,
  SupplyAndDifficultyGrid
} from "@/components/screens/market-insights/market-insights-sections";

export function MarketInsightsScreen() {
  const chart = useChartTheme();

  return (
    <div className="space-y-6">
      <MarketInsightsHeader />
      <SalaryBenchmarkCard chart={chart} />
      <SupplyAndDifficultyGrid chart={chart} />
      <BestPostingTimeCard chart={chart} />
      <RegionalDemandCard />
    </div>
  );
}
