import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonDataTableProps {
  rows?: number;
  cols?: number;
}

export function SkeletonDataTable({ rows = 5, cols = 6 }: SkeletonDataTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[22px] border border-border bg-card shadow-soft"
    >
      {/* Header */}
      <div className="flex gap-4 border-b border-border px-5 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows with staggered entrance */}
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: i * 0.06 }}
          className="flex gap-4 border-b border-border/50 px-5 py-4 last:border-0"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              className={`h-4 flex-1 ${j === 0 ? "max-w-[60%]" : ""}`}
            />
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
}
