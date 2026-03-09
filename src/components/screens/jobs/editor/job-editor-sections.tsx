"use client";

import { Briefcase, DollarSign, MapPin, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkeletonForm } from "@/components/skeletons/skeleton-form";
import type { Job } from "@/lib/firebase/types";

const benefitsOptions = [
  "Remote",
  "Health Insurance",
  "401k",
  "Unlimited PTO",
  "Equity",
  "Learning Budget"
];

interface JobEditorHeaderProps {
  isNew: boolean;
  onCancel: () => void;
}

interface JobEditorFormCardProps {
  isNew: boolean;
  jobId?: string;
  jobData: Job | null;
  isLoading: boolean;
  selectedBenefits: string[];
  tags: string[];
  onToggleBenefit: (benefit: string) => void;
  onRemoveTag: (tag: string) => void;
}

interface JobEditorPreviewCardProps {
  selectedBenefits: string[];
  tags: string[];
}

export function JobEditorHeader({ isNew, onCancel }: JobEditorHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
      <div>
        <h1 className="mb-1">{isNew ? "Create New Job" : "Edit Job Card"}</h1>
        <p className="text-sm text-muted-foreground">Design your job card for maximum engagement</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button>{isNew ? "Publish Job" : "Save Changes"}</Button>
      </div>
    </div>
  );
}

export function JobEditorFormCard({
  isNew,
  jobId,
  jobData,
  isLoading,
  selectedBenefits,
  tags,
  onToggleBenefit,
  onRemoveTag
}: JobEditorFormCardProps) {
  if (isLoading && jobId) {
    return <SkeletonForm fields={8} />;
  }

  const title = isNew ? "" : (jobData?.title ?? "");
  const minSalary = isNew ? "" : (jobData?.salaryMin?.toLocaleString() ?? "");
  const maxSalary = isNew ? "" : (jobData?.salaryMax?.toLocaleString() ?? "");
  const location = isNew ? "" : (jobData?.location ?? "");
  const workType = isNew
    ? ""
    : [jobData?.type, jobData?.locationType].filter(Boolean).join(", ");
  const description = isNew ? "" : (jobData?.description ?? "");

  return (
    <Card className="space-y-6 rounded-[10px] border-border bg-card p-5 shadow-soft">
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          defaultValue={title}
          className="mt-2"
          placeholder="e.g. Senior Product Designer"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="minSalary">Min Salary</Label>
          <div className="relative mt-2">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="minSalary" defaultValue={minSalary} className="pl-10" />
          </div>
        </div>

        <div>
          <Label htmlFor="maxSalary">Max Salary</Label>
          <div className="relative mt-2">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="maxSalary" defaultValue={maxSalary} className="pl-10" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <div className="relative mt-2">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="location" defaultValue={location} className="pl-10" />
        </div>
      </div>

      <div>
        <Label htmlFor="workType">Work Type</Label>
        <div className="relative mt-2">
          <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="workType" defaultValue={workType} className="pl-10" />
        </div>
      </div>

      <div>
        <Label htmlFor="hook">Hook (First 2 lines)</Label>
        <Textarea
          id="hook"
          defaultValue=""
          className="mt-2 min-h-[80px]"
        />
        <p className="mt-1 text-xs text-muted-foreground">This appears prominently on the job card</p>
      </div>

      <div>
        <Label>Benefits</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {benefitsOptions.map((benefit) => (
            <Badge
              key={benefit}
              onClick={() => onToggleBenefit(benefit)}
              className={`cursor-pointer transition-colors ${
                selectedBenefits.includes(benefit)
                  ? "border-0 bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover"
                  : "border-0 bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {benefit}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Full Description</Label>
        <Textarea
          id="description"
          defaultValue={description}
          className="mt-2 min-h-[200px]"
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} className="bg-muted pr-1 text-foreground">
              {tag}
              <button
                onClick={() => onRemoveTag(tag)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-lynq-accent/30 text-lynq-accent hover:bg-lynq-accent-muted"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Optimize with AI
      </Button>
    </Card>
  );
}

export function JobEditorPreviewCard({ selectedBenefits, tags }: JobEditorPreviewCardProps) {
  return (
    <div className="h-fit xl:sticky xl:top-24">
      <div className="mb-4 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Live Preview</span>
      </div>

      <div className="mx-auto h-[667px] w-[375px] overflow-hidden rounded-[3rem] border-8 border-border bg-background shadow-2xl">
        <div className="h-full overflow-y-auto bg-card p-6">
          <Card className="overflow-hidden rounded-3xl border-border bg-gradient-to-br from-card to-background">
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lynq-accent text-xl font-bold text-lynq-accent-foreground">
                  T
                </div>
                <div>
                  <h3 className="font-bold">TechCorp Inc.</h3>
                  <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold">Senior Product Designer</h2>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Shape the future of our product experience. Join a world-class design team building tools used by millions.
              </p>

              <div className="flex items-center gap-2 font-semibold text-success">
                <DollarSign className="h-5 w-5" />
                <span>$120,000 - $180,000</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedBenefits.map((benefit) => (
                  <Badge key={benefit} className="border-0 bg-muted text-foreground">
                    {benefit}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border pt-2">
                {tags.map((tag) => (
                  <Badge key={tag} className="border-0 bg-muted/50 text-xs text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button className="mt-4 w-full bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover">
                Apply Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
