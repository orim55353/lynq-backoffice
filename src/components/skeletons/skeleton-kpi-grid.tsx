import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonKpiGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-[22px] border border-border bg-card p-5 shadow-soft">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-3 h-8 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
