"use client";

import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useFirestoreCollection } from "./use-firestore-subscription";
import { createDocument } from "@/lib/firebase/firestore";
import { SYSTEM_TEMPLATES } from "@/lib/data/system-templates";
import type { Job, JobTemplate, ShiftType, PayFrequency, PayType, Urgency } from "@/lib/firebase/types";

// ─── Types ────────────────────────────────────────────────────

interface CreateTemplateInput {
  readonly name: string;
  readonly category: JobTemplate["category"];
  readonly fields: Partial<
    Omit<Job, "id" | "orgId" | "createdAt" | "updatedAt" | "createdBy" | "status">
  >;
}

interface TemplateFields {
  readonly title?: string;
  readonly department?: string;
  readonly description?: string;
  readonly requirements?: readonly string[];
  readonly physicalRequirements?: readonly string[];
  readonly certifications?: readonly string[];
  readonly benefits?: readonly string[];
  readonly skills?: readonly string[];
  readonly type?: Job["type"];
  readonly payType?: PayType;
  readonly shiftType?: ShiftType;
  readonly salaryMin?: number;
  readonly salaryMax?: number;
  readonly shiftSchedule?: string;
  readonly hourlyPayMin?: number;
  readonly hourlyPayMax?: number;
  readonly overtimeRate?: number | null;
  readonly payFrequency?: PayFrequency;
  readonly experienceYears?: number;
  readonly transportRequired?: boolean;
  readonly urgency?: Urgency;
}

// ─── useTemplates ─────────────────────────────────────────────

export function useTemplates() {
  const { orgId } = useAuth();

  const collectionPath = orgId
    ? `organizations/${orgId}/jobTemplates`
    : "";

  const {
    data: orgTemplates,
    isLoading,
  } = useFirestoreCollection<JobTemplate>({
    queryKey: ["jobTemplates", orgId],
    collectionPath,
    constraints: [],
    enabled: !!orgId,
  });

  const allTemplates = useMemo(() => {
    const system = SYSTEM_TEMPLATES.map((t) => ({
      ...t,
      isSystem: true as const,
    }));

    const org = (orgTemplates ?? []).map((t) => ({
      ...t,
      isSystem: false as const,
    }));

    return [...system, ...org];
  }, [orgTemplates]);

  return {
    systemTemplates: SYSTEM_TEMPLATES,
    orgTemplates: orgTemplates ?? [],
    allTemplates,
    isLoading,
  } as const;
}

// ─── useCreateTemplate ────────────────────────────────────────

export function useCreateTemplate() {
  const { orgId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTemplateInput) => {
      if (!orgId) throw new Error("No organization selected");

      const { name, category, fields } = input;

      if (!name.trim()) {
        throw new Error("Template name is required");
      }

      const id = `tpl-${Date.now()}`;
      const collectionPath = `organizations/${orgId}/jobTemplates`;

      await createDocument(collectionPath, id, {
        orgId,
        name: name.trim(),
        category,
        fields,
        isSystem: false,
        usageCount: 0,
      });

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobTemplates", orgId] });
    },
  });
}

// ─── useApplyTemplate ─────────────────────────────────────────

export function useApplyTemplate(templateId: string | undefined) {
  const { orgTemplates } = useTemplates();

  const templateFields = useMemo((): TemplateFields | null => {
    if (!templateId) return null;

    // Check system templates first
    const systemTemplate = SYSTEM_TEMPLATES.find((t) => t.id === templateId);
    if (systemTemplate) {
      return {
        title: systemTemplate.fields.title,
        department: systemTemplate.fields.department,
        description: systemTemplate.fields.description,
        requirements: [...systemTemplate.fields.requirements],
        physicalRequirements: [...systemTemplate.fields.physicalRequirements],
        certifications: [...systemTemplate.fields.certifications],
        benefits: [...systemTemplate.fields.benefits],
        skills: [...systemTemplate.fields.skills],
        type: systemTemplate.fields.type,
        payType: systemTemplate.fields.payType,
        shiftType: systemTemplate.fields.shiftType,
        shiftSchedule: systemTemplate.fields.shiftSchedule,
        hourlyPayMin: systemTemplate.fields.hourlyPayMin,
        hourlyPayMax: systemTemplate.fields.hourlyPayMax,
        overtimeRate: systemTemplate.fields.overtimeRate,
        payFrequency: systemTemplate.fields.payFrequency,
        experienceYears: systemTemplate.fields.experienceYears,
        transportRequired: systemTemplate.fields.transportRequired,
        urgency: systemTemplate.fields.urgency,
      };
    }

    // Then check org templates
    const orgTemplate = orgTemplates.find((t) => t.id === templateId);
    if (orgTemplate) {
      return {
        title: orgTemplate.fields.title,
        department: orgTemplate.fields.department,
        description: orgTemplate.fields.description,
        requirements: orgTemplate.fields.requirements
          ? [...orgTemplate.fields.requirements]
          : undefined,
        benefits: orgTemplate.fields.benefits
          ? [...orgTemplate.fields.benefits]
          : undefined,
        skills: orgTemplate.fields.skills
          ? [...orgTemplate.fields.skills]
          : undefined,
        type: orgTemplate.fields.type,
      };
    }

    return null;
  }, [templateId, orgTemplates]);

  return templateFields;
}
