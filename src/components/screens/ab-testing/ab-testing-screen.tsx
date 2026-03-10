"use client";

import { useRouter } from "next/navigation";
import { useChartTheme } from "@/lib/chart-theme";
import { useAbTests } from "@/lib/hooks/use-ab-tests";
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
  const { data: tests, isLoading } = useAbTests();
  const activeTest = tests?.find((t) => t.status === "active") ?? tests?.[0] ?? null;

  return (
    <div className="space-y-6">
      <AbTestingHeader onBack={() => router.push("/jobs")} />
      <ActiveTestCard test={activeTest} isLoading={isLoading} />
      <VersionComparisonGrid test={activeTest} isLoading={isLoading} />
      <PerformanceComparisonChart test={activeTest} isLoading={isLoading} chart={chart} />
      <TestRecommendationCard test={activeTest} isLoading={isLoading} />
    </div>
  );
}
