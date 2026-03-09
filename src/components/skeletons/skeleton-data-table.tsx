import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonDataTableProps {
  rows?: number;
  cols?: number;
}

export function SkeletonDataTable({ rows = 5, cols = 6 }: SkeletonDataTableProps) {
  return (
    <div className="rounded-[22px] border border-border bg-card shadow-soft">
      <div className="flex gap-4 border-b border-border px-5 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b border-border/50 px-5 py-4 last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
