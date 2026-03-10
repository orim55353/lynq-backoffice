"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  Shield,
  Truck,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SkeletonForm } from "@/components/skeletons/skeleton-form";
import { AIOptimizeButton } from "./ai-optimize-button";
import { BiasDetector } from "./bias-detector";
import type {
  Job,
  ShiftType,
  Urgency,
  PayFrequency,
  PayType,
} from "@/lib/firebase/types";
import type { BiasState } from "@/lib/hooks/use-job-score";
import type { AIFieldName, OptimizeFieldResult } from "@/lib/ai/types";

// ─── Constants ────────────────────────────────────────────────

const BENEFITS_OPTIONS = [
  "Overtime Pay",
  "Weekly Pay",
  "Sign-on Bonus",
  "Tool Allowance",
  "PPE Provided",
  "Steel-toe Boots Provided",
  "Union",
  "Health Insurance",
  "Dental Insurance",
  "401k",
  "Paid Time Off",
  "Holiday Pay",
  "Training Provided",
  "Company Vehicle",
  "Staff Meals",
  "Employee Discount",
];

const SHIFT_TYPES: { value: ShiftType; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "night", label: "Night" },
  { value: "swing", label: "Swing" },
  { value: "rotating", label: "Rotating" },
  { value: "flexible", label: "Flexible" },
];

const URGENCY_OPTIONS: { value: Urgency; label: string }[] = [
  { value: "immediate", label: "Hiring Immediately" },
  { value: "within_week", label: "Within 1 Week" },
  { value: "within_month", label: "Within 30 Days" },
  { value: "flexible", label: "Flexible Timeline" },
];

const PAY_FREQUENCY_OPTIONS: { value: PayFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
];

const COMMON_PHYSICAL_REQS = [
  "Lift 25lbs",
  "Lift 50lbs",
  "Lift 75lbs+",
  "Stand 8+ hours",
  "Walk/move constantly",
  "Work outdoors",
  "Work in cold/hot environments",
  "Climb ladders",
  "Repetitive motions",
  "Operate heavy machinery",
  "Work in tight spaces",
  "Kneel and crouch frequently",
];

const COMMON_CERTIFICATIONS = [
  "CDL Class A",
  "CDL Class B",
  "OSHA 10",
  "OSHA 30",
  "Forklift Certified",
  "EPA 608",
  "First Aid/CPR",
  "AWS Welding Cert",
  "Electrical License",
  "Plumbing License",
  "HVAC Certification",
  "Food Handler's Card",
  "ServSafe",
  "CNA",
  "HHA",
  "CNC Programming",
];

// ─── Prop Types ───────────────────────────────────────────────

interface JobEditorHeaderProps {
  isNew: boolean;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

interface JobEditorFormCardProps {
  isNew: boolean;
  jobId?: string;
  jobData: Job | null;
  isLoading: boolean;
  // Form values
  title: string;
  onTitleChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  department: string;
  onDepartmentChange: (v: string) => void;
  // Pay
  payType: PayType;
  onPayTypeChange: (v: PayType) => void;
  hourlyPayMin: string;
  onHourlyPayMinChange: (v: string) => void;
  hourlyPayMax: string;
  onHourlyPayMaxChange: (v: string) => void;
  overtimeRate: string;
  onOvertimeRateChange: (v: string) => void;
  payFrequency: PayFrequency;
  onPayFrequencyChange: (v: PayFrequency) => void;
  salaryMin: string;
  onSalaryMinChange: (v: string) => void;
  salaryMax: string;
  onSalaryMaxChange: (v: string) => void;
  // Shift
  shiftType: ShiftType | null;
  onShiftTypeChange: (v: ShiftType | null) => void;
  shiftSchedule: string;
  onShiftScheduleChange: (v: string) => void;
  urgency: Urgency;
  onUrgencyChange: (v: Urgency) => void;
  // Requirements
  physicalRequirements: string[];
  onTogglePhysicalReq: (req: string) => void;
  certifications: string[];
  onAddCertification: (cert: string) => void;
  onRemoveCertification: (cert: string) => void;
  experienceYears: string;
  onExperienceYearsChange: (v: string) => void;
  transportRequired: boolean;
  onTransportRequiredChange: (v: boolean) => void;
  // Benefits & skills
  selectedBenefits: string[];
  onToggleBenefit: (benefit: string) => void;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  // AI
  onOptimizeField: (field: AIFieldName) => void;
  getOptimizeState: (field: AIFieldName) => {
    isLoading: boolean;
    result: OptimizeFieldResult | null;
  };
  onDismissOptimize: (field: AIFieldName) => void;
  onAcceptOptimize: (field: AIFieldName, value: string) => void;
  descriptionBias: BiasState;
  onBiasFix: (original: string, suggestion: string) => void;
}

interface JobEditorPreviewCardProps {
  title: string;
  payType: PayType;
  payDisplay: string;
  overtimeRate: string;
  payFrequency: PayFrequency;
  shiftType: ShiftType | null;
  shiftSchedule: string;
  urgency: Urgency;
  location: string;
  transportRequired: boolean;
  physicalRequirements: string[];
  certifications: string[];
  selectedBenefits: string[];
  description: string;
}

// ─── Collapsible Section Helper ───────────────────────────────

function CollapsibleSection({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-1"
      >
        <h3 className="text-sm font-semibold text-foreground">
          {title}{" "}
          {subtitle && (
            <span className="font-normal text-muted-foreground">
              {subtitle}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {!open && badge && (
            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
              {badge}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "" : "rotate-180"}`}
          />
        </div>
      </button>
      {open && <div className="mt-3 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Tag Input Helper ─────────────────────────────────────────

function TagInput({
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
  suggestions,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  suggestions?: string[];
}) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAdd = (value?: string) => {
    const trimmed = (value ?? input).trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
      setInput("");
      setShowSuggestions(false);
    }
  };

  const filtered =
    suggestions?.filter(
      (s) =>
        !items.includes(s) && s.toLowerCase().includes(input.toLowerCase()),
    ) ?? [];

  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-2">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleAdd()}
            disabled={!input.trim()}
            type="button"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {showSuggestions && input && filtered.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-border bg-card shadow-soft">
            {filtered.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                className="w-full px-3 py-1.5 text-left text-sm text-foreground hover:bg-muted"
                onClick={() => {
                  handleAdd(s);
                  setShowSuggestions(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      {items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge key={item} className="bg-muted pr-1 text-foreground">
              {item}
              <button
                onClick={() => onRemove(item)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────

export function JobEditorHeader({
  isNew,
  onCancel,
  onSave,
  isSaving,
}: JobEditorHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="mb-1">
            {isNew ? "Create New Job" : "Edit Job Listing"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details your candidates need to see
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={isSaving}>
          {isNew ? "Publish Job" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

// ─── Form Card ────────────────────────────────────────────────

export function JobEditorFormCard(props: JobEditorFormCardProps) {
  const {
    jobId,
    isLoading,
    title,
    onTitleChange,
    description,
    onDescriptionChange,
    location,
    onLocationChange,
    department,
    onDepartmentChange,
    payType,
    onPayTypeChange,
    hourlyPayMin,
    onHourlyPayMinChange,
    hourlyPayMax,
    onHourlyPayMaxChange,
    overtimeRate,
    onOvertimeRateChange,
    payFrequency,
    onPayFrequencyChange,
    salaryMin,
    onSalaryMinChange,
    salaryMax,
    onSalaryMaxChange,
    shiftType,
    onShiftTypeChange,
    shiftSchedule,
    onShiftScheduleChange,
    urgency,
    onUrgencyChange,
    physicalRequirements,
    onTogglePhysicalReq,
    certifications,
    onAddCertification,
    onRemoveCertification,
    experienceYears,
    onExperienceYearsChange,
    transportRequired,
    onTransportRequiredChange,
    selectedBenefits,
    onToggleBenefit,
    tags,
    onAddTag,
    onRemoveTag,
    onOptimizeField,
    getOptimizeState,
    onDismissOptimize,
    onAcceptOptimize,
    descriptionBias,
    onBiasFix,
  } = props;

  if (isLoading && jobId) {
    return <SkeletonForm fields={10} />;
  }

  const buildContext = (): Record<string, unknown> => ({
    title,
    description,
    location,
    department,
    hourlyPayMin,
    hourlyPayMax,
    shiftType,
    shiftSchedule,
    physicalRequirements,
    certifications,
  });

  const titleState = getOptimizeState("title");
  const descState = getOptimizeState("description");

  return (
    <Card className="space-y-6 rounded-[10px] border-border bg-card p-5 shadow-soft">
      {/* Section 1: Job Basics */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Job Basics</h3>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="title">Job Title</Label>
            <AIOptimizeButton
              field="title"
              currentValue={title}
              jobContext={buildContext()}
              onAccept={(v) => onAcceptOptimize("title", v)}
              isLoading={titleState.isLoading}
              result={
                titleState.result
                  ? {
                      optimized: titleState.result.optimizedValue,
                      reasoning: titleState.result.reasoning,
                      confidence: titleState.result.confidenceScore,
                    }
                  : null
              }
              onOptimize={() => onOptimizeField("title")}
              onDismiss={() => onDismissOptimize("title")}
            />
          </div>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="mt-2"
            placeholder="e.g. Forklift Operator, Line Cook, CDL Driver"
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="mt-2"
            placeholder="e.g. Warehouse, Kitchen, Construction"
          />
        </div>
        <div>
          <Label htmlFor="location">Location / Job Site</Label>
          <div className="relative mt-2">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="pl-10"
              placeholder="e.g. 123 Industrial Blvd, Houston TX"
            />
          </div>
        </div>
      </div>

      <hr className="border-border" />

      {/* Section 2: Pay & Compensation */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Pay & Compensation
        </h3>

        {/* Pay type toggle */}
        <div className="flex rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => onPayTypeChange("hourly")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              payType === "hourly"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Hourly Rate
          </button>
          <button
            type="button"
            onClick={() => onPayTypeChange("salary")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              payType === "salary"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual Salary
          </button>
        </div>

        {/* Hourly fields */}
        {payType === "hourly" && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="payMin">Min Hourly Rate</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="payMin"
                    value={hourlyPayMin}
                    onChange={(e) => onHourlyPayMinChange(e.target.value)}
                    className="pl-10"
                    placeholder="16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    /hr
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="payMax">Max Hourly Rate</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="payMax"
                    value={hourlyPayMax}
                    onChange={(e) => onHourlyPayMaxChange(e.target.value)}
                    className="pl-10"
                    placeholder="22"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    /hr
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="overtime">Overtime Rate</Label>
                <select
                  id="overtime"
                  value={overtimeRate}
                  onChange={(e) => onOvertimeRateChange(e.target.value)}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-input-background px-3 text-sm text-foreground"
                >
                  <option value="">None</option>
                  <option value="1.5">1.5x (time-and-a-half)</option>
                  <option value="2">2x (double time)</option>
                </select>
              </div>
              <div>
                <Label>Pay Frequency</Label>
                <div className="mt-2 flex gap-2">
                  {PAY_FREQUENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onPayFrequencyChange(opt.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        payFrequency === opt.value
                          ? "bg-lynq-accent text-lynq-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Salary fields */}
        {payType === "salary" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="salaryMin">Min Annual Salary</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="salaryMin"
                  value={salaryMin}
                  onChange={(e) => onSalaryMinChange(e.target.value)}
                  className="pl-10"
                  placeholder="45,000"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  /yr
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="salaryMax">Max Annual Salary</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="salaryMax"
                  value={salaryMax}
                  onChange={(e) => onSalaryMaxChange(e.target.value)}
                  className="pl-10"
                  placeholder="65,000"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  /yr
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Benefits */}
        <div>
          <Label>Benefits</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {BENEFITS_OPTIONS.map((benefit) => (
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
      </div>

      <hr className="border-border" />

      {/* Section 3: Shift & Schedule (collapsible) */}
      <CollapsibleSection
        title="Shift & Schedule"
        subtitle="(optional)"
        badge={
          shiftType || shiftSchedule
            ? `${[shiftType, shiftSchedule].filter(Boolean).join(" · ")}`
            : undefined
        }
      >
        <div>
          <Label>Shift Type</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SHIFT_TYPES.map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() =>
                  onShiftTypeChange(shiftType === st.value ? null : st.value)
                }
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  shiftType === st.value
                    ? "bg-lynq-accent text-lynq-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                <Clock className="mr-1 inline h-3 w-3" />
                {st.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="schedule">Schedule</Label>
          <Input
            id="schedule"
            value={shiftSchedule}
            onChange={(e) => onShiftScheduleChange(e.target.value)}
            className="mt-2"
            placeholder="e.g. Mon-Fri 6am-2pm, 4 on / 3 off"
          />
        </div>
      </CollapsibleSection>

      <hr className="border-border" />

      {/* Section 4: Requirements */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Requirements</h3>
        <div>
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={experienceYears}
            onChange={(e) => onExperienceYearsChange(e.target.value)}
            className="mt-2"
            placeholder="0 = no experience needed"
          />
        </div>
        <div>
          <Label>Urgency</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {URGENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUrgencyChange(opt.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  urgency === opt.value
                    ? "bg-lynq-accent text-lynq-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4b: Physical, Certs & Logistics (collapsible) */}
      <CollapsibleSection
        title="Physical, Certifications & Logistics"
        subtitle="(optional)"
        badge={
          [
            physicalRequirements.length > 0
              ? `${physicalRequirements.length} physical`
              : "",
            certifications.length > 0 ? `${certifications.length} certs` : "",
            transportRequired ? "vehicle req." : "",
          ]
            .filter(Boolean)
            .join(" · ") || undefined
        }
      >
        <div>
          <Label>Physical Requirements</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {COMMON_PHYSICAL_REQS.map((req) => (
              <Badge
                key={req}
                onClick={() => onTogglePhysicalReq(req)}
                className={`cursor-pointer transition-colors ${
                  physicalRequirements.includes(req)
                    ? "border-0 bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover"
                    : "border-0 bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                <Shield className="mr-1 inline h-3 w-3" />
                {req}
              </Badge>
            ))}
          </div>
        </div>
        <TagInput
          label="Certifications / Licenses"
          placeholder="e.g. CDL Class A, OSHA 10..."
          items={certifications}
          onAdd={onAddCertification}
          onRemove={onRemoveCertification}
          suggestions={COMMON_CERTIFICATIONS}
        />
        <div>
          <Label>Personal Vehicle Required?</Label>
          <div className="mt-2 flex items-center gap-3">
            <Switch
              checked={transportRequired}
              onCheckedChange={onTransportRequiredChange}
            />
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              {transportRequired ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </CollapsibleSection>

      <hr className="border-border" />

      {/* Section 5: Description */}
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Job Description</Label>
          <AIOptimizeButton
            field="description"
            currentValue={description}
            jobContext={buildContext()}
            onAccept={(v) => onAcceptOptimize("description", v)}
            isLoading={descState.isLoading}
            result={
              descState.result
                ? {
                    optimized: descState.result.optimizedValue,
                    reasoning: descState.result.reasoning,
                    confidence: descState.result.confidenceScore,
                  }
                : null
            }
            onOptimize={() => onOptimizeField("description")}
            onDismiss={() => onDismissOptimize("description")}
          />
        </div>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="mt-2 min-h-[200px]"
          placeholder={
            "What you will do each day:\n- Task 1\n- Task 2\n- Task 3\n\nUse bullet points. Keep it simple."
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Write in plain language. Use bullet points. Describe what they will
          actually do each day.
        </p>
        <BiasDetector
          biasState={descriptionBias}
          onFix={onBiasFix}
          className="mt-2"
        />
      </div>

      <hr className="border-border" />

      {/* Section 6: Tags / Skills */}
      <TagInput
        label="Tags / Skills"
        placeholder="e.g. Forklift, Welding, HVAC..."
        items={tags}
        onAdd={onAddTag}
        onRemove={onRemoveTag}
      />
    </Card>
  );
}

// ─── Mobile Preview Card (Blue-Collar Optimized) ──────────────

export function JobEditorPreviewCard({
  title,
  payType,
  payDisplay,
  overtimeRate,
  payFrequency,
  shiftType,
  shiftSchedule,
  urgency,
  location,
  transportRequired,
  physicalRequirements,
  certifications,
  selectedBenefits,
  description,
}: JobEditorPreviewCardProps) {
  const urgencyLabel: Record<Urgency, string> = {
    immediate: "Hiring Now",
    within_week: "Start This Week",
    within_month: "Within 30 Days",
    flexible: "Flexible Start",
  };

  const freqLabel: Record<PayFrequency, string> = {
    weekly: "Weekly Pay",
    biweekly: "Biweekly Pay",
    monthly: "Monthly Pay",
  };

  // Extract first 3-5 bullet points from description
  const bullets = description
    .split("\n")
    .filter((l) => /^\s*[-*•]/.test(l))
    .slice(0, 4)
    .map((l) => l.replace(/^\s*[-*•]\s*/, ""));

  return (
    <div className="h-fit xl:sticky xl:top-24">
      <div className="mb-4 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Mobile Preview</span>
      </div>

      <div className="mx-auto h-[667px] w-[375px] overflow-hidden rounded-[3rem] border-8 border-border bg-background shadow-2xl">
        <div className="h-full overflow-y-auto bg-card p-5">
          {/* Company */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lynq-accent text-lg font-bold text-lynq-accent-foreground">
              {title ? title.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <p className="text-sm font-semibold">Your Company</p>
              <p className="text-xs text-muted-foreground">
                {location || "Location"}
              </p>
            </div>
          </div>

          {/* Pay — large and prominent */}
          <div className="mt-4 rounded-xl bg-success/10 p-4">
            <p className="text-2xl font-bold text-success">
              {payDisplay || "$--"}
              <span className="text-sm font-normal">
                {payType === "hourly" ? "/hr" : "/yr"}
              </span>
            </p>
            {payType === "hourly" && overtimeRate && (
              <p className="mt-0.5 text-xs text-success/80">
                + Overtime: {overtimeRate}x after 40hrs
              </p>
            )}
            {payType === "hourly" && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {freqLabel[payFrequency]}
              </p>
            )}
          </div>

          {/* Title */}
          <h2 className="mt-3 text-lg font-bold">{title || "Job Title"}</h2>

          {/* Quick facts strip */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {shiftType && (
              <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-[11px] font-medium text-info">
                <Clock className="h-3 w-3" />
                {shiftType.charAt(0).toUpperCase() + shiftType.slice(1)} Shift
              </span>
            )}
            {shiftSchedule && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {shiftSchedule}
              </span>
            )}
            {urgency !== "flexible" && (
              <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
                {urgencyLabel[urgency]}
              </span>
            )}
            {transportRequired && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                <Truck className="h-3 w-3" />
                Vehicle Required
              </span>
            )}
          </div>

          {/* Physical Requirements */}
          {physicalRequirements.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">
                Physical Requirements
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {physicalRequirements.map((req) => (
                  <span
                    key={req}
                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">
                Required Certs
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="rounded bg-lynq-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-lynq-accent"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {selectedBenefits.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">
                Benefits
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedBenefits.slice(0, 6).map((b) => (
                  <span
                    key={b}
                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground"
                  >
                    {b}
                  </span>
                ))}
                {selectedBenefits.length > 6 && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    +{selectedBenefits.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description bullets */}
          {bullets.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">
                What You Will Do
              </p>
              <ul className="mt-1 space-y-0.5">
                {bullets.map((b, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    • {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply button */}
          <Button className="mt-4 w-full bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
