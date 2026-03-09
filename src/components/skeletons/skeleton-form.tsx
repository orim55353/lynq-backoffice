import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonFormProps {
  fields?: number;
}

export function SkeletonForm({ fields = 6 }: SkeletonFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[22px] border border-border bg-card p-5 shadow-soft"
    >
      <Skeleton className="mb-6 h-6 w-40" />
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: fields }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </motion.div>
          ))}
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </motion.div>
  );
}
