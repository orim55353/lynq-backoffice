import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_ease-in-out_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-foreground/[0.06] before:to-transparent",
        className
      )}
    />
  );
}
