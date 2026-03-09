"use client";

import {
  Briefcase,
  Building,
  CheckCircle,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
  X,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Candidate,
  CandidateStage,
  stages
} from "@/components/screens/candidates/candidates-data";

interface CandidateDetailPanelProps {
  candidate: Candidate;
  onStageChange: (candidateId: number, stage: CandidateStage) => void;
  onOpenFullProfile: (candidateId: number) => void;
  onClose: () => void;
}

export function CandidateDetailPanel({
  candidate,
  onStageChange,
  onOpenFullProfile,
  onClose
}: CandidateDetailPanelProps) {
  const engagementTextColor =
    candidate.engagement === "High"
      ? "text-success"
      : candidate.engagement === "Medium"
        ? "text-warning"
        : "text-muted-foreground";

  const advanceCandidate = () => {
    const stageIndex = stages.indexOf(candidate.stage);
    if (stageIndex >= 0 && stageIndex < stages.length - 2) {
      onStageChange(candidate.id, stages[stageIndex + 1]);
    }
  };

  return (
    <>
      <div className="flex-shrink-0 border-b border-border bg-card p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="mr-2 flex flex-1 items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-info/10 text-info">{candidate.avatar}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold">{candidate.name}</h3>
              <p className="truncate text-sm text-muted-foreground">{candidate.role}</p>
              <p className="truncate text-xs text-muted-foreground">{candidate.location}</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 hover:bg-muted">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-muted p-3 text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-info">
              <Sparkles className="h-4 w-4" />
              <span className="text-2xl font-bold">{candidate.fitScore}</span>
            </div>
            <p className="text-xs text-muted-foreground">Fit Score</p>
          </div>

          <div className="rounded-2xl bg-muted p-3 text-center">
            <div className="mb-1 text-2xl font-bold text-chart-4">{candidate.intentScore}</div>
            <p className="text-xs text-muted-foreground">Intent</p>
          </div>

          <div className="rounded-2xl bg-muted p-3 text-center">
            <div className={`mb-1 text-2xl font-bold ${engagementTextColor}`}>
              {candidate.engagement}
            </div>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-card p-5">
        <Card className="rounded-2xl border-border bg-muted p-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.phone}</span>
            </div>
            {candidate.linkedin ? (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{candidate.linkedin}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.location}</span>
            </div>
            {candidate.currentCompany ? (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.currentCompany}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.experience} experience</span>
            </div>
          </div>
        </Card>

        {candidate.skills.length ? (
          <Card className="rounded-2xl border-border bg-muted p-4">
            <h4 className="mb-3 text-sm font-semibold">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} className="border border-info/20 bg-info/10 text-xs text-info">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        ) : null}

        {candidate.note ? (
          <Card className="rounded-2xl border-border bg-muted p-4">
            <h4 className="mb-2 text-sm font-semibold">Notes</h4>
            <p className="text-sm">{candidate.note}</p>
          </Card>
        ) : null}

        <Card className="rounded-2xl border-border bg-muted p-4">
          <h4 className="mb-2 text-sm font-semibold">Latest Activity</h4>
          <p className="text-sm">{candidate.lastActivity}</p>
          <p className="mt-1 text-xs text-muted-foreground">Applied {candidate.appliedDate}</p>
        </Card>
      </div>

      <div className="flex-shrink-0 space-y-2 border-t border-border bg-card p-5">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={advanceCandidate} className="rounded-xl bg-info text-white hover:bg-info/90">
            <CheckCircle className="mr-2 h-4 w-4" />
            Advance
          </Button>

          <Button
            variant="outline"
            onClick={() => onStageChange(candidate.id, "Rejected")}
            className="rounded-xl border-danger/30 text-danger hover:bg-danger/10"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>

        <Button variant="outline" className="w-full rounded-xl" onClick={() => onOpenFullProfile(candidate.id)}>
          Open Full Profile
        </Button>
        <Button variant="outline" className="w-full rounded-xl">
          <MessageSquare className="mr-2 h-4 w-4" />
          Send Message
        </Button>
        <Button variant="outline" className="w-full rounded-xl">
          <Star className="mr-2 h-4 w-4" />
          Save for Later
        </Button>
      </div>
    </>
  );
}
