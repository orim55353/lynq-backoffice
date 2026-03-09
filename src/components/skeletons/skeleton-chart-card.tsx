import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonChartCard() {
  return (
    <div className="rounded-[22px] border border-border bg-card p-5 shadow-soft">
      <Skeleton className="mb-4 h-5 w-40" />
      <Skeleton className="h-[280px] w-full rounded-lg" />
    </div>
  );
}
