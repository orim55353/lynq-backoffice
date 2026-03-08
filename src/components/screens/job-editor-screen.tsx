"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  JobEditorFormCard,
  JobEditorHeader,
  JobEditorPreviewCard
} from "@/components/screens/job-editor/job-editor-sections";

interface JobEditorScreenProps {
  id: string;
}

export function JobEditorScreen({ id }: JobEditorScreenProps) {
  const router = useRouter();
  const isNew = useMemo(() => id === "new", [id]);

  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([
    "Remote",
    "Health Insurance",
    "401k"
  ]);
  const [tags, setTags] = useState<string[]>(["Design", "Product", "Full-time"]);

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
