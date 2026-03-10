// ─── Job Lifecycle State Machine — Pure Functions ─────────────
// Zero React/Firebase dependencies. Deterministic logic only.

export type JobStatus = "draft" | "active" | "paused" | "closed" | "archived";

interface JobForValidation {
  title?: string;
  description?: string;
  status: JobStatus;
  qualityScore?: number;
}

export interface TransitionResult {
  readonly valid: boolean;
  readonly reason?: string;
}

// ─── State Transition Map ──────────────────────────────────────

const VALID_TRANSITIONS: Readonly<Record<JobStatus, readonly JobStatus[]>> = {
  draft: ["active"],
  active: ["paused", "closed"],
  paused: ["active", "closed"],
  closed: ["archived"],
  archived: [],
} as const;

// ─── Core Functions ────────────────────────────────────────────

/** Check if a status transition is structurally allowed. */
export function canTransition(from: JobStatus, to: JobStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/** Get all valid target statuses from a given status. */
export function getAvailableTransitions(status: JobStatus): readonly JobStatus[] {
  return [...VALID_TRANSITIONS[status]];
}

/** Validate a transition with business rules. */
export function validateTransition(job: JobForValidation, target: JobStatus): TransitionResult {
  if (!canTransition(job.status, target)) {
    return { valid: false, reason: `Cannot transition from "${job.status}" to "${target}"` };
  }

  // Draft → Active: requires title + description + quality score
  if (job.status === "draft" && target === "active") {
    if (!job.title?.trim()) {
      return { valid: false, reason: "Job title is required to publish" };
    }
    if (!job.description?.trim()) {
      return { valid: false, reason: "Job description is required to publish" };
    }
    if (job.qualityScore != null && job.qualityScore < 60) {
      return { valid: false, reason: `Quality score must be at least 60 to publish (currently ${job.qualityScore})` };
    }
  }

  // Paused → Active: re-validate content
  if (job.status === "paused" && target === "active") {
    if (!job.title?.trim()) {
      return { valid: false, reason: "Job title is required to resume" };
    }
    if (!job.description?.trim()) {
      return { valid: false, reason: "Job description is required to resume" };
    }
  }

  return { valid: true };
}

/** Whether the transition requires a confirmation dialog. */
export function isDestructiveTransition(target: JobStatus): boolean {
  return target === "closed" || target === "archived";
}

// ─── Display Helpers ───────────────────────────────────────────

/** Tailwind classes for status badge background + text. */
export function getStatusColor(status: JobStatus): string {
  const colors: Record<JobStatus, string> = {
    draft: "bg-muted/50 text-muted-foreground",
    active: "bg-success/10 text-success",
    paused: "bg-warning/10 text-warning",
    closed: "bg-danger/10 text-danger",
    archived: "bg-muted/30 text-muted-foreground/70",
  };
  return colors[status];
}

/** Human-readable status label. */
export function getStatusLabel(status: JobStatus): string {
  const labels: Record<JobStatus, string> = {
    draft: "Draft",
    active: "Active",
    paused: "Paused",
    closed: "Closed",
    archived: "Archived",
  };
  return labels[status];
}

/** Button label for a status transition. */
export function getTransitionLabel(from: JobStatus, to: JobStatus): string {
  const key = `${from}-${to}`;
  const labels: Record<string, string> = {
    "draft-active": "Publish",
    "active-paused": "Pause",
    "paused-active": "Resume",
    "active-closed": "Close",
    "paused-closed": "Close",
    "closed-archived": "Archive",
  };
  return labels[key] ?? to.charAt(0).toUpperCase() + to.slice(1);
}

/** Button variant for a transition target. */
export function getTransitionVariant(target: JobStatus): "default" | "outline" | "destructive" {
  if (target === "active") return "default";
  if (target === "closed" || target === "archived") return "destructive";
  return "outline";
}
