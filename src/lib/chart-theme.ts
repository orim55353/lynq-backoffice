"use client";

import { useTheme } from "next-themes";

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return {
    gridStroke: isDark ? "#2D3748" : "#E2E8F0",
    axisStroke: isDark ? "#94A3B8" : "#64748B",
    tooltipStyle: {
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      border: `1px solid ${isDark ? "#2D3748" : "#E2E8F0"}`,
      borderRadius: "8px",
      color: isDark ? "#F9FAFB" : "#0F172A"
    }
  };
}

export type ChartTheme = ReturnType<typeof useChartTheme>;
