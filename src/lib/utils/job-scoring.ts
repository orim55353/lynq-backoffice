// ─── Blue-Collar Job Quality Scoring — Pure Functions ──────────
// Zero dependencies. Same input always gives same output.

/** Minimal job fields needed for scoring */
interface JobFields {
  title?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  location?: string;
  payType?: "hourly" | "salary";
  hourlyPayMin?: number | null;
  hourlyPayMax?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  overtimeRate?: number | null;
  payFrequency?: string;
  shiftType?: string | null;
  shiftSchedule?: string;
  startDate?: unknown;
  physicalRequirements?: string[];
  certifications?: string[];
  experienceYears?: number | null;
  transportRequired?: boolean;
}

export interface LocalScoreResult {
  readonly payTransparency: number;
  readonly shiftClarity: number;
  readonly requirementsClarity: number;
  readonly locationLogistics: number;
  readonly readability: number;
  readonly localTotal: number;
}

export interface LocalBiasResult {
  readonly hasGenderedLanguage: boolean;
  readonly genderedTermsFound: readonly string[];
  readonly jargonTermsFound: readonly string[];
  readonly educationBiasFound: readonly string[];
  readonly ageBiasFound: readonly string[];
}

// ─── Constants ─────────────────────────────────────────────────

export const JARGON_WORDS: readonly string[] = [
  "synergy", "leverage", "pivot", "disrupt", "bandwidth",
  "circle back", "deep dive", "move the needle", "paradigm shift",
  "scalable", "agile", "10x", "best-in-class", "world-class",
  "cutting-edge", "passionate about", "self-starter", "go-getter",
  "dynamic environment", "fast-paced", "wear many hats",
  "hit the ground running", "rockstar", "ninja", "guru",
  "think outside the box", "results-driven", "proactive",
  "stakeholder", "deliverables", "kpis", "mission-driven",
  "culture fit", "innovative mindset",
] as const;

export const GENDERED_TERMS: readonly string[] = [
  "manpower", "mankind", "chairman", "salesman", "saleswoman",
  "stewardess", "fireman", "policeman", "craftsman", "spokesman",
  "lineman", "foreman", "handyman", "repairman",
  "workman", "draftsman", "he/she", "his/her", "guys", "you guys",
  "manhole", "man-hours",
] as const;

export const EDUCATION_BIAS_TERMS: readonly string[] = [
  "bachelor's degree", "college degree", "university degree",
  "master's degree", "mba", "higher education",
  "degree required", "degree preferred",
] as const;

export const AGE_BIAS_TERMS: readonly string[] = [
  "young and energetic", "digital native", "recent graduate",
  "young professional", "fresh out of school", "youthful",
  "high energy", "tech-savvy generation",
] as const;

// ─── Helpers ───────────────────────────────────────────────────

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

function splitIntoSentences(text: string): string[] {
  return text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0);
}

function countJargon(text: string): number {
  const lower = text.toLowerCase();
  return JARGON_WORDS.filter((term) => lower.includes(term)).length;
}

function hasBulletPoints(text: string): boolean {
  const lines = text.split("\n");
  const bulletLines = lines.filter((l) => /^\s*[-*•]\s/.test(l));
  return bulletLines.length >= 2;
}

// ─── Pay Transparency (30% weight) ────────────────────────────

export function computePayTransparency(job: JobFields): number {
  let score = 0;
  const isHourly = job.payType !== "salary";

  if (isHourly) {
    if (job.hourlyPayMin != null && job.hourlyPayMax != null) score += 60;
    else if (job.hourlyPayMin != null || job.hourlyPayMax != null) score += 30;
    if (job.overtimeRate != null) score += 20;
    if (job.payFrequency && job.payFrequency !== "biweekly") score += 20;
    else if (job.payFrequency === "biweekly") score += 10;
  } else {
    if (job.salaryMin != null && job.salaryMax != null) score += 70;
    else if (job.salaryMin != null || job.salaryMax != null) score += 35;
    // Salary jobs get partial credit even without overtime/frequency
    score += 30;
  }

  return Math.min(100, score);
}

// ─── Shift Clarity (25% weight) ───────────────────────────────

export function computeShiftClarity(job: JobFields): number {
  let score = 0;

  // For salary/white-collar jobs, shift info is optional — give baseline credit
  const isSalary = job.payType === "salary";
  if (isSalary && !job.shiftType && !job.shiftSchedule?.trim()) {
    return 60; // neutral — not penalized for omitting shifts on salaried roles
  }

  if (job.shiftType != null) score += 40;
  if (job.shiftSchedule?.trim()) score += 40;
  if (job.startDate != null) score += 20;
  return Math.min(100, score);
}

// ─── Requirements Clarity (20% weight) ────────────────────────

export function computeRequirementsClarity(job: JobFields): number {
  let score = 0;
  if ((job.physicalRequirements?.length ?? 0) >= 2) score += 40;
  else if ((job.physicalRequirements?.length ?? 0) >= 1) score += 20;
  if ((job.certifications?.length ?? 0) >= 1) score += 30;
  if (job.experienceYears != null) score += 30;
  return Math.min(100, score);
}

// ─── Location & Logistics (15% weight) ────────────────────────

export function computeLocationLogistics(job: JobFields): number {
  let score = 0;
  if (job.location?.trim()) score += 65;
  if (job.transportRequired !== undefined) score += 35;
  return Math.min(100, score);
}

// ─── Readability (10% weight) ─────────────────────────────────

export function computeReadability(text: string): number {
  if (!text.trim()) return 0;

  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) return 0;

  // Sentence length score (target: ≤15 words average)
  const avgWords = sentences.reduce((sum, s) => sum + countWords(s), 0) / sentences.length;
  let sentenceScore: number;
  if (avgWords <= 15) sentenceScore = 100;
  else if (avgWords <= 25) sentenceScore = 100 - (avgWords - 15) * 5;
  else sentenceScore = Math.max(0, 50 - (avgWords - 25) * 3);

  // Jargon penalty
  const jargonCount = countJargon(text);
  const jargonScore = Math.max(0, 100 - jargonCount * 15);

  // Bullet points bonus
  const bulletScore = hasBulletPoints(text) ? 100 : 30;

  return Math.round(sentenceScore * 0.4 + jargonScore * 0.3 + bulletScore * 0.3);
}

// ─── Combined Local Score ──────────────────────────────────────

export function computeLocalScore(job: JobFields): LocalScoreResult {
  const payTransparency = computePayTransparency(job);
  const shiftClarity = computeShiftClarity(job);
  const requirementsClarity = computeRequirementsClarity(job);
  const locationLogistics = computeLocationLogistics(job);
  const readability = computeReadability(job.description ?? "");

  // Weighted total: pay 30%, shift 25%, requirements 20%, location 15%, readability 10%
  const localTotal = Math.round(
    payTransparency * 0.30 +
    shiftClarity * 0.25 +
    requirementsClarity * 0.20 +
    locationLogistics * 0.15 +
    readability * 0.10,
  );

  return { payTransparency, shiftClarity, requirementsClarity, locationLogistics, readability, localTotal };
}

// ─── Local Bias Check ──────────────────────────────────────────

export function checkLocalBias(text: string): LocalBiasResult {
  const lower = text.toLowerCase();
  const genderedTermsFound = GENDERED_TERMS.filter((t) => lower.includes(t));
  const jargonTermsFound = JARGON_WORDS.filter((t) => lower.includes(t));
  const educationBiasFound = EDUCATION_BIAS_TERMS.filter((t) => lower.includes(t));
  const ageBiasFound = AGE_BIAS_TERMS.filter((t) => lower.includes(t));

  return {
    hasGenderedLanguage: genderedTermsFound.length > 0,
    genderedTermsFound,
    jargonTermsFound,
    educationBiasFound,
    ageBiasFound,
  };
}
