"use client";

import { TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function MarketInsightsScreen() {
  return (
    //      <div className="space-y-6">
    // <MarketInsightsHeader />
    // <SalaryBenchmarkCard chart={chart} />
    // <SupplyAndDifficultyGrid chart={chart} />
    // <BestPostingTimeCard chart={chart} />
    // <RegionalDemandCard />
    // </div>
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={<TrendingUp className="h-6 w-6" />}
        title="Coming Soon"
        description="Market Insights is currently under development. Stay tuned for salary benchmarks, talent supply data, and hiring trends."
      />
    </div>
  );
}
