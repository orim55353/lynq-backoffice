"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateFullProfileContent } from "@/components/screens/candidate-full-profile-content";

interface CandidateDetailScreenProps {
  id: string;
}

export function CandidateDetailScreen({ id }: CandidateDetailScreenProps) {
  const router = useRouter();
  const numericId = Number(id);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push("/candidates")} className="-ml-2 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>
      <CandidateFullProfileContent id={numericId} />
    </div>
  );
}
