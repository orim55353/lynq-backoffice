import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCandidateList() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 6 }).map((_, colIdx) => (
        <motion.div
          key={colIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: colIdx * 0.06 }}
          className="w-80 flex-shrink-0"
        >
          <div className="rounded-[28px] border border-border/80 bg-card p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: colIdx < 2 ? 3 : colIdx < 4 ? 2 : 1 }).map((_, cardIdx) => (
                <div key={cardIdx} className="rounded-[22px] border border-border/50 bg-background p-3">
                  <Skeleton className="mb-2 h-5 w-32 rounded-full" />
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
