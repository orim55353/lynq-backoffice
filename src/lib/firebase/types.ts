import type { Timestamp } from "firebase/firestore";

// ─── Base ──────────────────────────────────────────────────────

interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Users ─────────────────────────────────────────────────────

export interface UserProfile extends BaseDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  activeOrgId: string | null;
  onboardingComplete: boolean;
}

// ─── Organizations ─────────────────────────────────────────────

export type OrgMemberRole = "owner" | "admin" | "recruiter" | "viewer";

export interface Organization extends BaseDocument {
  name: string;
  slug: string;
  logoURL: string | null;
  industry: string;
  website: string;
  plan: "free" | "pro" | "enterprise";
  billingEmail: string;
  settings: {
    timezone: string;
    defaultCurrency: string;
    brandColor: string;
  };
}

export interface OrgMember extends BaseDocument {
  userId: string;
  email: string;
  displayName: string;
  role: OrgMemberRole;
  invitedBy: string;
  joinedAt: Timestamp;
}

// ─── Jobs ──────────────────────────────────────────────────────

export type JobStatus = "draft" | "active" | "paused" | "closed" | "archived";
export type JobType = "full-time" | "part-time" | "contract" | "internship" | "temporary";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";

export interface Job extends BaseDocument {
  orgId: string;
  title: string;
  department: string;
  location: string;
  locationType: "onsite" | "remote" | "hybrid";
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  status: JobStatus;
  publishedAt: Timestamp | null;
  closesAt: Timestamp | null;
  createdBy: string;
  viewCount: number;
  applicationCount: number;
}

// ─── Candidates ────────────────────────────────────────────────

export type CandidateStage = "applied" | "reviewed" | "interview" | "offer" | "hired" | "rejected";
export type EngagementLevel = "high" | "medium" | "low";

export interface Candidate extends BaseDocument {
  orgId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedinURL: string;
  resumeURL: string | null;
  avatarURL: string | null;
  currentCompany: string;
  currentRole: string;
  experienceYears: number;
  skills: string[];
  availability: string;
  source: "direct" | "linkedin" | "referral" | "agency" | "other";
  tags: string[];
}

// ─── Applications ──────────────────────────────────────────────

export type ApplicationStatus = "pending" | "reviewing" | "shortlisted" | "interview" | "offer" | "hired" | "rejected" | "withdrawn";

export interface Application extends BaseDocument {
  orgId: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  stage: CandidateStage;
  fitScore: number;
  intentScore: number;
  engagement: EngagementLevel;
  appliedAt: Timestamp;
  lastActivity: string;
  notes: string;
  reviewedBy: string | null;
  interviewDates: Timestamp[];
  offerAmount: number | null;
}

// ─── Sponsored Campaigns ───────────────────────────────────────

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

export interface Campaign extends BaseDocument {
  orgId: string;
  jobId: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  currency: string;
  startDate: Timestamp;
  endDate: Timestamp;
  targetAudience: {
    locations: string[];
    skills: string[];
    experienceLevels: ExperienceLevel[];
  };
  metrics: {
    impressions: number;
    clicks: number;
    applications: number;
    ctr: number;
    costPerClick: number;
    costPerApplication: number;
  };
  createdBy: string;
}

// ─── Analytics ─────────────────────────────────────────────────

export type AnalyticsEventType =
  | "job_view"
  | "job_apply"
  | "job_save"
  | "candidate_view"
  | "candidate_shortlist"
  | "interview_schedule"
  | "offer_extend"
  | "offer_accept"
  | "offer_decline";

export interface AnalyticsEvent extends BaseDocument {
  orgId: string;
  eventType: AnalyticsEventType;
  jobId: string | null;
  candidateId: string | null;
  userId: string;
  timestamp: Timestamp;
  metadata: Record<string, string | number | boolean>;
}

// ─── Billing ───────────────────────────────────────────────────

export interface BillingRecord extends BaseDocument {
  orgId: string;
  plan: "free" | "pro" | "enterprise";
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  invoices: {
    id: string;
    amount: number;
    currency: string;
    status: "paid" | "pending" | "failed";
    date: Timestamp;
  }[];
}

// ─── Notifications ─────────────────────────────────────────────

export type NotificationType =
  | "new_application"
  | "interview_reminder"
  | "offer_response"
  | "campaign_update"
  | "system";

export interface Notification extends BaseDocument {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionURL: string | null;
  metadata: Record<string, string>;
}
