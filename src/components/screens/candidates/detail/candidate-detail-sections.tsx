"use client";

import type { ReactNode } from "react";
import {
  Briefcase,
  Calendar,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export interface CandidateDetailViewModel {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  fitScore: number;
  intentScore: number;
  engagement: string;
  skills: string[];
  matchExplanation: string;
  engagementBehavior: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  timeline: Array<{
    date: string;
    event: string;
    type: "system" | "engagement";
  }>;
}

interface CandidateDetailSectionsProps {
  data: CandidateDetailViewModel;
}

export function CandidateProfileHeader({ data }: CandidateDetailSectionsProps) {
  return (
    <Card className="rounded-2xl border-border bg-card p-6">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-lynq-accent-muted text-2xl text-lynq-accent">{data.avatar}</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="mb-1 text-2xl font-bold">{data.name}</h1>
            <p className="mb-3 text-muted-foreground">{data.role}</p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <DetailMeta icon={<Mail className="h-4 w-4" />} value={data.email} />
              <DetailMeta icon={<Phone className="h-4 w-4" />} value={data.phone} />
              <DetailMeta icon={<MapPin className="h-4 w-4" />} value={data.location} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 md:grid-cols-3">
        <ScoreCard
          title="Fit Score"
          value={data.fitScore}
          icon={<Sparkles className="h-4 w-4" />}
          accent="text-lynq-accent"
        />
        <ScoreCard
          title="Intent Score"
          value={data.intentScore}
          icon={<Sparkles className="h-4 w-4" />}
          accent="text-success"
        />
        <div className="text-center">
          <p className="mb-1 text-sm text-muted-foreground">Engagement</p>
          <Badge className="border-0 bg-success/10 px-4 py-1 text-lg text-success">{data.engagement}</Badge>
        </div>
      </div>
    </Card>
  );
}

export function CandidatePrimaryColumn({ data }: CandidateDetailSectionsProps) {
  return (
    <div className="space-y-6 xl:col-span-2">
      <Card className="rounded-[10px] border-lynq-accent/15 bg-card p-5 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-lynq-accent" />
          <h2 className="text-lg font-semibold">AI Match Explanation</h2>
          <span className="rounded bg-lynq-accent-muted px-1.5 py-0.5 text-[10px] font-medium text-lynq-accent">
            AI
          </span>
        </div>
        <p className="leading-relaxed text-muted-foreground">{data.matchExplanation}</p>
      </Card>

      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill} className="border-0 bg-muted px-3 py-1 text-foreground">
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Experience</h2>
        </div>
        <div className="space-y-4">
          {data.experience.map((experience, index) => (
            <div key={`${experience.title}-${index}`} className="border-l-2 border-lynq-accent/40 pl-4">
              <h3 className="font-semibold">{experience.title}</h3>
              <p className="text-sm text-muted-foreground">{experience.company}</p>
              <p className="mb-2 text-xs text-muted-foreground">{experience.duration}</p>
              <p className="text-sm">{experience.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Education</h2>
        </div>
        <div className="space-y-3">
          {data.education.map((education, index) => (
            <div key={`${education.degree}-${index}`}>
              <h3 className="font-semibold">{education.degree}</h3>
              <p className="text-sm text-muted-foreground">{education.school}</p>
              <p className="text-xs text-muted-foreground">{education.year}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Resume</h2>
          </div>
          <Button variant="outline" size="sm">
            Download PDF
          </Button>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 text-center text-muted-foreground">
          Resume preview placeholder
        </div>
      </Card>
    </div>
  );
}

export function CandidateSecondaryColumn({ data }: CandidateDetailSectionsProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold">Engagement Behavior</h2>
        <ul className="space-y-2 text-sm">
          {data.engagementBehavior.map((behavior, index) => (
            <li key={`${behavior}-${index}`} className="flex items-start gap-2">
              <span className="mt-1 text-success">v</span>
              <span>{behavior}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold">Notes</h2>
        <Textarea placeholder="Add notes about this candidate..." className="min-h-[100px]" />
        <Button className="mt-3 w-full" variant="outline">
          Save Note
        </Button>
      </Card>

      <Card className="rounded-[10px] border-border bg-card p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold">Activity Timeline</h2>
        <div className="space-y-3">
          {data.timeline.map((item, index) => (
            <div key={`${item.event}-${index}`} className="flex gap-3">
              <div
                className={`mt-1.5 h-2 w-2 rounded-full ${item.type === "system" ? "bg-info" : "bg-chart-2"}`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DetailMeta({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span>{value}</span>
    </div>
  );
}

function ScoreCard({
  title,
  value,
  icon,
  accent
}: {
  title: string;
  value: number;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <div className="text-center">
      <div className={`mb-1 flex items-center justify-center gap-1 ${accent}`}>
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
