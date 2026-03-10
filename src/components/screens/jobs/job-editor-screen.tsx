"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJob, useCreateJob, useUpdateJob } from "@/lib/hooks/use-jobs";
import { useJobScore, useDetectBias } from "@/lib/hooks/use-job-score";
import { useOptimizeField } from "@/lib/hooks/use-ai-jobs";
import { useTransitionJob } from "@/lib/hooks/use-job-lifecycle";
import {
  JobEditorFormCard,
  JobEditorHeader,
  JobEditorPreviewCard,
} from "@/components/screens/jobs/editor/job-editor-sections";
import { JobQualityScore } from "@/components/screens/jobs/editor/job-quality-score";
import { JobStatusBar } from "@/components/screens/jobs/editor/job-status-bar";
import { AIGenerateModal } from "@/components/screens/jobs/editor/ai-generate-modal";
import type { AIFieldName } from "@/lib/ai/types";
import type { JobStatus } from "@/lib/utils/job-lifecycle";
import type { ShiftType, Urgency, PayFrequency, PayType } from "@/lib/firebase/types";

interface JobEditorScreenProps {
  id: string;
}

export function JobEditorScreen({ id }: JobEditorScreenProps) {
  const router = useRouter();
  const isNew = useMemo(() => id === "new", [id]);
  const { data: jobData, isLoading } = useJob(isNew ? undefined : id);

  // ─── Controlled form state ──────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");

  // Pay & compensation
  const [payType, setPayType] = useState<PayType>("hourly");
  const [hourlyPayMin, setHourlyPayMin] = useState("");
  const [hourlyPayMax, setHourlyPayMax] = useState("");
  const [overtimeRate, setOvertimeRate] = useState("");
  const [payFrequency, setPayFrequency] = useState<PayFrequency>("weekly");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  // Shift & schedule
  const [shiftType, setShiftType] = useState<ShiftType | null>(null);
  const [shiftSchedule, setShiftSchedule] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("flexible");

  // Requirements
  const [physicalRequirements, setPhysicalRequirements] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState("");
  const [transportRequired, setTransportRequired] = useState(false);

  // Benefits & skills
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // UI
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  // Seed from loaded job data
  useEffect(() => {
    if (!jobData) return;
    setTitle(jobData.title ?? "");
    setDescription(jobData.description ?? "");
    setLocation(jobData.location ?? "");
    setDepartment(jobData.department ?? "");
    // Infer pay type: explicit field > has salary data > default hourly
    const inferredPayType = jobData.payType
      ?? ((jobData.salaryMin || jobData.salaryMax) && !jobData.hourlyPayMin ? "salary" : "hourly");
    setPayType(inferredPayType);
    setHourlyPayMin(jobData.hourlyPayMin?.toString() ?? "");
    setHourlyPayMax(jobData.hourlyPayMax?.toString() ?? "");
    setOvertimeRate(jobData.overtimeRate?.toString() ?? "");
    setPayFrequency(jobData.payFrequency ?? "weekly");
    setSalaryMin(jobData.salaryMin?.toString() ?? "");
    setSalaryMax(jobData.salaryMax?.toString() ?? "");
    setShiftType(jobData.shiftType ?? null);
    setShiftSchedule(jobData.shiftSchedule ?? "");
    setUrgency(jobData.urgency ?? "flexible");
    if (jobData.physicalRequirements?.length) setPhysicalRequirements(jobData.physicalRequirements);
    if (jobData.certifications?.length) setCertifications(jobData.certifications);
    setExperienceYears(jobData.experienceYears?.toString() ?? "");
    setTransportRequired(jobData.transportRequired ?? false);
    if (jobData.benefits?.length) setSelectedBenefits(jobData.benefits);
    if (jobData.skills?.length) setTags(jobData.skills);
  }, [jobData]);

  // ─── AI Hooks ───────────────────────────────────────────────
  const jobPartial = useMemo(
    () => ({
      title,
      description,
      requirements: [] as string[],
      benefits: selectedBenefits,
      skills: tags,
      location,
      payType,
      hourlyPayMin: hourlyPayMin ? Number(hourlyPayMin) : undefined,
      hourlyPayMax: hourlyPayMax ? Number(hourlyPayMax) : undefined,
      salaryMin: salaryMin ? Number(salaryMin.replace(/,/g, "")) : undefined,
      salaryMax: salaryMax ? Number(salaryMax.replace(/,/g, "")) : undefined,
      overtimeRate: overtimeRate ? Number(overtimeRate) : undefined,
      payFrequency,
      shiftType: shiftType ?? undefined,
      shiftSchedule: shiftSchedule || undefined,
      startDate: undefined,
      physicalRequirements,
      certifications,
      experienceYears: experienceYears ? Number(experienceYears) : undefined,
      transportRequired,
    }),
    [
      title, description, selectedBenefits, tags, location,
      payType, hourlyPayMin, hourlyPayMax, salaryMin, salaryMax,
      overtimeRate, payFrequency, shiftType, shiftSchedule,
      physicalRequirements, certifications, experienceYears, transportRequired,
    ],
  );

  const scoreState = useJobScore(jobPartial);
  const descriptionBias = useDetectBias(description);
  const { optimize, dismissField, getFieldState } = useOptimizeField();
  const transitionMutation = useTransitionJob();
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();

  // ─── Save / Publish ────────────────────────────────────────
  const buildJobData = useCallback(() => ({
    title,
    department,
    location,
    locationType: "onsite" as const,
    type: "full-time" as const,
    description,
    requirements: [] as string[],
    benefits: selectedBenefits,
    skills: tags,
    status: "draft" as const,
    publishedAt: null,
    closesAt: null,
    payType,
    hourlyPayMin: hourlyPayMin ? Number(hourlyPayMin) : null,
    hourlyPayMax: hourlyPayMax ? Number(hourlyPayMax) : null,
    overtimeRate: overtimeRate ? Number(overtimeRate) : null,
    payFrequency,
    salaryMin: salaryMin ? Number(salaryMin.replace(/,/g, "")) : null,
    salaryMax: salaryMax ? Number(salaryMax.replace(/,/g, "")) : null,
    currency: "USD",
    shiftType,
    shiftSchedule,
    startDate: null,
    urgency,
    physicalRequirements,
    certifications,
    experienceYears: experienceYears ? Number(experienceYears) : null,
    transportRequired,
    qualityScore: scoreState.score,
    qualityBreakdown: scoreState.breakdown,
  }), [
    title, department, location, description, selectedBenefits, tags,
    payType, hourlyPayMin, hourlyPayMax, overtimeRate, payFrequency,
    salaryMin, salaryMax, shiftType, shiftSchedule, urgency,
    physicalRequirements, certifications, experienceYears, transportRequired,
    scoreState.score, scoreState.breakdown,
  ]);

  const handleSave = useCallback(async () => {
    const data = buildJobData();
    if (isNew) {
      const newId = await createJobMutation.mutateAsync(data);
      router.push(`/jobs/${newId}`);
    } else {
      await updateJobMutation.mutateAsync({ id, data });
    }
  }, [isNew, id, buildJobData, createJobMutation, updateJobMutation, router]);

  const isSaving = createJobMutation.isPending || updateJobMutation.isPending;

  // ─── Optimize handlers ──────────────────────────────────────
  const handleOptimizeField = useCallback(
    (field: AIFieldName) => {
      const valueMap: Record<AIFieldName, string> = {
        title,
        description,
        requirements: "",
        benefits: selectedBenefits.join(", "),
        skills: tags.join(", "),
      };
      optimize({
        field,
        currentValue: valueMap[field],
        context: { title, description, location, benefits: selectedBenefits, skills: tags },
      });
    },
    [title, description, location, selectedBenefits, tags, optimize],
  );

  const getOptimizeStateForField = useCallback(
    (field: AIFieldName) => {
      const state = getFieldState(field);
      return {
        isLoading: state.status === "loading",
        result: state.result,
      };
    },
    [getFieldState],
  );

  const handleAcceptOptimize = useCallback(
    (field: AIFieldName, value: string) => {
      const setters: Record<string, (v: string) => void> = {
        title: setTitle,
        description: setDescription,
      };
      const setter = setters[field];
      if (setter) setter(value);
      dismissField(field);
    },
    [dismissField],
  );

  // ─── Lifecycle handlers ─────────────────────────────────────
  const handleTransition = useCallback(
    (target: JobStatus, reason?: string) => {
      if (!jobData) return;
      transitionMutation.mutate({
        jobId: id,
        job: {
          status: jobData.status,
          title: jobData.title,
          description: jobData.description,
          qualityScore: scoreState.score,
        },
        targetStatus: target,
        closedReason: reason,
      });
    },
    [id, jobData, scoreState.score, transitionMutation],
  );

  // ─── AI Generate apply handler ──────────────────────────────
  const handleApplyGenerated = useCallback(
    (result: Record<string, string>, acceptedFields: readonly string[]) => {
      for (const field of acceptedFields) {
        const value = result[field];
        if (!value) continue;
        switch (field) {
          case "title":
            setTitle(value);
            break;
          case "description":
            setDescription(value);
            break;
          case "benefits":
            setSelectedBenefits(value.split(", ").filter(Boolean));
            break;
          case "requirements":
            setTags(value.split(", ").filter(Boolean));
            break;
          case "shiftSchedule":
            setShiftSchedule(value);
            break;
          case "hourlyPayMin":
            setHourlyPayMin(value);
            break;
          case "hourlyPayMax":
            setHourlyPayMax(value);
            break;
        }
      }
    },
    [],
  );

  // ─── Bias fix handler ───────────────────────────────────────
  const handleBiasFix = useCallback(
    (original: string, suggestion: string) => {
      if (description.toLowerCase().includes(original.toLowerCase())) {
        setDescription((prev) =>
          prev.replace(new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), suggestion),
        );
      }
    },
    [description],
  );

  // ─── Toggle helpers ─────────────────────────────────────────
  const toggleBenefit = (benefit: string) => {
    setSelectedBenefits((current) =>
      current.includes(benefit)
        ? current.filter((item) => item !== benefit)
        : [...current, benefit],
    );
  };

  const togglePhysicalReq = (req: string) => {
    setPhysicalRequirements((current) =>
      current.includes(req)
        ? current.filter((item) => item !== req)
        : [...current, req],
    );
  };

  const payDisplay = payType === "hourly"
    ? (hourlyPayMin && hourlyPayMax ? `$${hourlyPayMin} - $${hourlyPayMax}/hr` : "")
    : (salaryMin && salaryMax ? `$${salaryMin} - $${salaryMax}/yr` : "");

  return (
    <div className="space-y-6">
      <JobEditorHeader
        isNew={isNew}
        onCancel={() => router.push("/jobs")}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Status bar (edit mode only) */}
      {!isNew && jobData && (
        <JobStatusBar
          status={jobData.status as JobStatus}
          qualityScore={scoreState.localReady ? scoreState.score : undefined}
          onTransition={handleTransition}
        />
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="space-y-6">
          {/* Generate with AI button */}
          <Button
            variant="outline"
            className="w-full border-lynq-accent/30 text-lynq-accent hover:bg-lynq-accent-muted"
            onClick={() => setGenerateModalOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>

          <JobEditorFormCard
            isNew={isNew}
            jobId={isNew ? undefined : id}
            jobData={jobData ?? null}
            isLoading={isLoading}
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
            location={location}
            onLocationChange={setLocation}
            department={department}
            onDepartmentChange={setDepartment}
            payType={payType}
            onPayTypeChange={setPayType}
            hourlyPayMin={hourlyPayMin}
            onHourlyPayMinChange={setHourlyPayMin}
            hourlyPayMax={hourlyPayMax}
            onHourlyPayMaxChange={setHourlyPayMax}
            overtimeRate={overtimeRate}
            onOvertimeRateChange={setOvertimeRate}
            payFrequency={payFrequency}
            onPayFrequencyChange={setPayFrequency}
            salaryMin={salaryMin}
            onSalaryMinChange={setSalaryMin}
            salaryMax={salaryMax}
            onSalaryMaxChange={setSalaryMax}
            shiftType={shiftType}
            onShiftTypeChange={setShiftType}
            shiftSchedule={shiftSchedule}
            onShiftScheduleChange={setShiftSchedule}
            urgency={urgency}
            onUrgencyChange={setUrgency}
            physicalRequirements={physicalRequirements}
            onTogglePhysicalReq={togglePhysicalReq}
            certifications={certifications}
            onAddCertification={(cert) => setCertifications((c) => [...c, cert])}
            onRemoveCertification={(cert) => setCertifications((c) => c.filter((i) => i !== cert))}
            experienceYears={experienceYears}
            onExperienceYearsChange={setExperienceYears}
            transportRequired={transportRequired}
            onTransportRequiredChange={setTransportRequired}
            selectedBenefits={selectedBenefits}
            onToggleBenefit={toggleBenefit}
            tags={tags}
            onAddTag={(tag) => setTags((current) => [...current, tag])}
            onRemoveTag={(tag) => setTags((current) => current.filter((item) => item !== tag))}
            onOptimizeField={handleOptimizeField}
            getOptimizeState={getOptimizeStateForField}
            onDismissOptimize={dismissField}
            onAcceptOptimize={handleAcceptOptimize}
            descriptionBias={descriptionBias}
            onBiasFix={handleBiasFix}
          />
        </div>

        <div className="space-y-6">
          {/* Quality Score Panel */}
          <JobQualityScore
            scoreState={{
              score: scoreState.score,
              breakdown: scoreState.breakdown,
              suggestions: scoreState.suggestions as Array<{ field: string; message: string; impact: "high" | "medium" | "low" }>,
              aiLoading: scoreState.aiLoading,
              localReady: scoreState.localReady,
            }}
          />

          <JobEditorPreviewCard
            title={title}
            payType={payType}
            payDisplay={payDisplay}
            overtimeRate={overtimeRate}
            payFrequency={payFrequency}
            shiftType={shiftType}
            shiftSchedule={shiftSchedule}
            urgency={urgency}
            location={location}
            transportRequired={transportRequired}
            physicalRequirements={physicalRequirements}
            certifications={certifications}
            selectedBenefits={selectedBenefits}
            description={description}
          />
        </div>
      </div>

      {/* AI Generate Modal */}
      <AIGenerateModal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onApply={handleApplyGenerated}
      />
    </div>
  );
}
