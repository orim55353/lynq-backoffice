"use client";

import { useRouter } from "next/navigation";
import { useChartTheme } from "@/lib/chart-theme";
import {
  AbTestingHeader,
  ActiveTestCard,
  PerformanceComparisonChart,
  TestRecommendationCard,
  VersionComparisonGrid
} from "@/components/screens/ab-testing/ab-testing-sections";

export function AbTestingScreen() {
  const router = useRouter();
  const chart = useChartTheme();

  return (
    <div className="space-y-6">
      <AbTestingHeader onBack={() => router.push("/job-cards")} />
      <ActiveTestCard />
      <VersionComparisonGrid />
      <PerformanceComparisonChart chart={chart} />
      <TestRecommendationCard />
    </div>
  );
}
