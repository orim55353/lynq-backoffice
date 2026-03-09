"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJob } from "@/lib/hooks/use-jobs";
import {
  JobEditorFormCard,
  JobEditorHeader,
  JobEditorPreviewCard
} from "@/components/screens/jobs/editor/job-editor-sections";

interface JobEditorScreenProps {
  id: string;
}

export function JobEditorScreen({ id }: JobEditorScreenProps) {
  const router = useRouter();
  const isNew = useMemo(() => id === "new", [id]);
  const { data: jobData, isLoading } = useJob(isNew ? undefined : id);

  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([
    "Remote",
    "Health Insurance",
    "401k"
  ]);
  const [tags, setTags] = useState<string[]>(["Design", "Product", "Full-time"]);

  useEffect(() => {
    if (jobData) {
      if (jobData.benefits?.length) setSelectedBenefits(jobData.benefits);
      if (jobData.skills?.length) setTags(jobData.skills);
    }
  }, [jobData]);

  const toggleBenefit = (benefit: string) => {
    setSelectedBenefits((current) =>
      current.includes(benefit)
        ? current.filter((item) => item !== benefit)
        : [...current, benefit]
    );
  };

  return (
    <div className="space-y-6">
      <JobEditorHeader isNew={isNew} onCancel={() => router.push("/job-cards")} />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="space-y-6">
          <JobEditorFormCard
            isNew={isNew}
            jobData={jobData ?? null}
            isLoading={isLoading}
            selectedBenefits={selectedBenefits}
            tags={tags}
            onToggleBenefit={toggleBenefit}
            onRemoveTag={(tag) => setTags((current) => current.filter((item) => item !== tag))}
          />
        </div>

        <JobEditorPreviewCard selectedBenefits={selectedBenefits} tags={tags} />
      </div>
    </div>
  );
}
