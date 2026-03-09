import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonChartCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[22px] border border-border bg-card p-5 shadow-soft"
    >
      <Skeleton className="mb-4 h-5 w-40" />
      <Skeleton className="h-[280px] w-full rounded-lg" />
    </motion.div>
  );
}
