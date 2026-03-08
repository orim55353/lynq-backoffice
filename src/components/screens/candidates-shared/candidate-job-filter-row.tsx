"use client";

import { motion } from "framer-motion";
import { jobs } from "@/components/screens/candidates-data";
import { layoutSpring, useLiftMotion, useTapMotion } from "@/components/ui/motion";

interface CandidateJobFilterRowProps {
  selectedJobId: string | null;
  totalCount: number;
  countsByJobId: Record<string, number>;
  onSelectJob: (jobId: string | null) => void;
}

export function CandidateJobFilterRow({
  selectedJobId,
  totalCount,
  countsByJobId,
  onSelectJob
}: CandidateJobFilterRowProps) {
  return (
    <motion.div layout className="-mt-1 flex gap-3 overflow-x-auto px-0 py-1 pb-2 pt-1">
      <FilterCard
        title="All Jobs"
        count={totalCount}
        isActive={selectedJobId === null}
        onClick={() => onSelectJob(null)}
      />
      {jobs.map((job) => (
        <FilterCard
          key={job.id}
          title={job.title}
          count={countsByJobId[job.id] ?? 0}
          isActive={selectedJobId === job.id}
          onClick={() => onSelectJob(job.id)}
        />
      ))}
    </motion.div>
  );
}

function FilterCard({
  title,
  count,
  isActive,
  onClick
}: {
  title: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const hoverLift = useLiftMotion();
  const tapMotion = useTapMotion();

  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      whileHover={isActive ? undefined : hoverLift}
      whileTap={tapMotion}
      transition={layoutSpring}
      className={`min-w-fit rounded-[24px] border px-5 py-3 text-left transition-colors duration-200 ${
        isActive
          ? "border-info/30 bg-info text-white shadow-[0_20px_44px_-28px_rgba(14,165,233,0.55)]"
          : "border-border bg-card shadow-soft hover:border-border"
      }`}
    >
      <div className="max-w-[200px] truncate text-sm font-medium">{title}</div>
      <motion.div layout className="mt-1 text-2xl font-semibold">
        {count}
      </motion.div>
    </motion.button>
  );
}
