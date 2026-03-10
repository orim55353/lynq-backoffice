# PRD: Job Listings System — Blue-Collar Pivot with AI Optimization

**Author:** Product Management
**Created:** 2026-03-09
**Updated:** 2026-03-09
**Status:** Draft
**Priority:** P0
**Type:** Major Pivot (replaces white-collar job listings system)

---

## 1. Problem Statement

Lynq's job listings system was built for white-collar/corporate hiring. The entire data model, editor UI, AI prompts, quality scoring, templates, and bias detection are optimized for knowledge workers — salaried roles with benefits like equity, remote work, and learning budgets.

Blue-collar hiring is fundamentally different:

1. **Pay structure is hourly, not salaried.** Candidates need to see hourly rate, overtime rate, and pay frequency (weekly pay is a major draw). The current `salaryMin/salaryMax` fields communicate the wrong thing entirely.

2. **Shifts matter more than "work type."** A warehouse worker needs to know if it is day shift or night shift, what days they work, and exact hours. "Full-time, Onsite" tells them almost nothing useful.

3. **Physical requirements are non-negotiable information.** "Lift 50lbs repeatedly," "stand 8+ hours," "work outdoors in all weather" — these are not nice-to-haves in a listing. They determine whether a candidate can physically do the job. The current system has no way to capture this.

4. **Certifications replace degrees.** Blue-collar candidates have CDLs, OSHA cards, welding certs, forklift licenses — not college degrees. The current system's `experienceLevel` (entry/mid/senior/lead/executive) is a corporate hierarchy that does not map to trades.

5. **Candidates browse on phones, scanning quickly.** Blue-collar job seekers scroll through listings on their phone during breaks. They need pay rate, shift, and location visible immediately — not a "hook" paragraph they have to read. The current mobile preview is designed for a corporate card format.

6. **Urgency drives applications.** "Hiring Now," "Start Monday," "Immediate openings" — these are powerful signals in blue-collar hiring. The current system has no urgency concept.

7. **Language must be simple and direct.** The current AI prompts generate content at a level appropriate for knowledge workers. Blue-collar listings need 8th-grade reading level, short sentences, zero jargon, and bullet-point format.

8. **Templates are completely wrong.** Software Engineer, Product Manager, UX Designer, Sales Representative, Marketing Manager, Customer Success Manager — none of these are relevant. We need Warehouse Associate, Forklift Operator, CDL Driver, Electrician, Welder, Line Cook.

**Impact:** Without this pivot, Lynq cannot serve blue-collar hiring managers at all. The tool produces listings that feel alien to the blue-collar workforce, use wrong compensation structures, miss critical job information (shifts, physical requirements, certifications), and generate content with corporate language that alienates the target candidates.

### User Pain Points (Blue-Collar Hiring Managers)

- "I just need to post that I need a forklift driver for night shift at $22/hr starting Monday. Why is this tool asking me about experience levels and hooks?"
- "My candidates don't read paragraphs. They want: how much, what shift, where, and can I start now?"
- "Half the templates are for tech jobs. I run a construction crew."
- "The AI-generated description sounds like it was written by HR at a Fortune 500. My workers will think it is a scam."
- "There is no place to put that you need a CDL or OSHA 10. Those are the most important requirements."

### Business Impact

- **Market expansion:** Blue-collar is 60%+ of the US workforce. This pivot unlocks a massive TAM.
- **Competitive positioning:** Most job platforms bolt blue-collar onto a white-collar core. Building native blue-collar UX is a differentiator.
- **Retention:** Hiring managers who cannot express their actual job requirements will churn. Getting the data model right is table stakes.
- **Time-to-hire:** Blue-collar roles are time-sensitive. Listings that clearly communicate pay, shift, and start date fill faster.

---

## 2. User Stories

### Epic 1: Blue-Collar Job Data Model

| ID | Story | Priority |
|----|-------|----------|
| US-1.1 | As a hiring manager, I want to enter hourly pay rate (min/max) and overtime rate so candidates know exactly what they will earn. | P0 |
| US-1.2 | As a hiring manager, I want to specify shift type (day/night/swing/rotating) and exact schedule (e.g., "Mon-Fri 6am-2pm") so candidates know if the schedule works for them. | P0 |
| US-1.3 | As a hiring manager, I want to list physical requirements (lifting, standing, outdoor work) so candidates can self-select based on ability. | P0 |
| US-1.4 | As a hiring manager, I want to list required certifications/licenses (CDL, OSHA, forklift, etc.) so only qualified candidates apply. | P0 |
| US-1.5 | As a hiring manager, I want to set urgency level and start date so candidates know the role is available now. | P0 |
| US-1.6 | As a hiring manager, I want to indicate if personal transportation is required so candidates who rely on public transit can filter appropriately. | P1 |
| US-1.7 | As a hiring manager, I want to specify pay frequency (weekly/biweekly/monthly) so candidates know when they get paid. | P1 |
| US-1.8 | As a hiring manager, I want to specify years of hands-on experience needed (not corporate seniority level) so requirements are clear. | P1 |

### Epic 2: Blue-Collar Job Editor UI

| ID | Story | Priority |
|----|-------|----------|
| US-2.1 | As a hiring manager, I want a pay section with hourly rate inputs, overtime rate, and pay frequency so I can communicate compensation clearly. | P0 |
| US-2.2 | As a hiring manager, I want a shift section with type selector, schedule input, and start date picker so shift details are complete. | P0 |
| US-2.3 | As a hiring manager, I want a physical requirements checklist (common options + custom) so I can quickly specify what the job demands. | P0 |
| US-2.4 | As a hiring manager, I want a certifications tag input with autocomplete for common certs so I do not have to type them from scratch. | P0 |
| US-2.5 | As a hiring manager, I want blue-collar specific benefits as toggleable badges (overtime pay, weekly pay, sign-on bonus, tool allowance, PPE provided, union, steel-toe boots provided) so I can highlight what matters to my candidates. | P0 |
| US-2.6 | As a hiring manager, I want an urgency badge selector ("Hiring Now" / "Starting Next Week" / "Within 30 Days") visible on the listing so it creates urgency. | P1 |

### Epic 3: Mobile Preview (Blue-Collar Optimized)

| ID | Story | Priority |
|----|-------|----------|
| US-3.1 | As a hiring manager, I want the mobile preview to show pay rate large and prominent at the top so candidates see money first. | P0 |
| US-3.2 | As a hiring manager, I want a quick-facts strip (shift type, start date, transport needed) immediately visible so candidates can scan in 3 seconds. | P0 |
| US-3.3 | As a hiring manager, I want physical requirements displayed as compact icons/badges so they are scannable. | P1 |
| US-3.4 | As a hiring manager, I want certifications shown as small badges so qualified candidates recognize them instantly. | P1 |
| US-3.5 | As a hiring manager, I want a big "Apply Now" or "Call to Apply" button so the action is clear. | P0 |

### Epic 4: AI Generation & Optimization (Blue-Collar)

| ID | Story | Priority |
|----|-------|----------|
| US-4.1 | As a hiring manager, I want AI to generate job descriptions in simple, direct language (8th-grade reading level) so my candidates can understand them. | P0 |
| US-4.2 | As a hiring manager, I want AI to avoid corporate buzzwords and use plain language so the listing does not feel out of touch. | P0 |
| US-4.3 | As a hiring manager, I want AI to suggest missing practical info (pay, shift, physical reqs) so my listing is complete. | P0 |
| US-4.4 | As a hiring manager, I want AI to generate listings from a template for common blue-collar roles so I can post quickly. | P1 |
| US-4.5 | As a hiring manager, I want AI to format descriptions as bullet points rather than paragraphs so they are easy to scan. | P1 |

### Epic 5: Quality Scoring (Blue-Collar Reweighted)

| ID | Story | Priority |
|----|-------|----------|
| US-5.1 | As a hiring manager, I want the quality score to prioritize pay transparency (is hourly rate stated?) so I know what matters most. | P0 |
| US-5.2 | As a hiring manager, I want the quality score to check shift clarity (are shift times and days defined?) so I do not miss critical info. | P0 |
| US-5.3 | As a hiring manager, I want the quality score to verify requirements clarity (physical reqs, certs, experience listed?) so candidates know what is needed. | P0 |
| US-5.4 | As a hiring manager, I want the quality score to check location and logistics (address, transport info) so candidates can assess commute. | P1 |
| US-5.5 | As a hiring manager, I want readability scored (simple language, short sentences, no jargon) so the listing is accessible. | P1 |

### Epic 6: Bias Detection (Blue-Collar Specific)

| ID | Story | Priority |
|----|-------|----------|
| US-6.1 | As a hiring manager, I want bias detection to flag unnecessary education requirements (e.g., "college degree" for manual labor jobs) so I do not exclude qualified candidates. | P0 |
| US-6.2 | As a hiring manager, I want bias detection to flag age-discriminatory language ("young and energetic," "digital native") so I stay compliant. | P0 |
| US-6.3 | As a hiring manager, I want bias detection to flag gender-coded language in trades ("manpower," assuming gender for roles) so my listings are inclusive. | P0 |
| US-6.4 | As a hiring manager, I want bias detection to flag physical ability assumptions beyond actual job requirements so I do not over-restrict the candidate pool. | P1 |
| US-6.5 | As a hiring manager, I want bias detection to flag immigration status hints and overqualification barriers so listings are fair and legal. | P1 |

### Epic 7: Templates (Blue-Collar)

| ID | Story | Priority |
|----|-------|----------|
| US-7.1 | As a hiring manager, I want pre-built templates for common blue-collar roles (warehouse, construction, trades, food service, driving, healthcare aide) so I can create listings in under 5 minutes. | P0 |
| US-7.2 | As a hiring manager, I want templates to include realistic hourly pay ranges, common certifications, and typical physical requirements for each role so I start from accurate data. | P1 |
| US-7.3 | As a hiring manager, I want to save my own listings as custom templates so I can reuse them for repeat postings. | P1 |

---

## 3. Competitive Analysis

| Feature | Indeed Blue | Jobcase | Wonolo | Instawork | Lynq (Current) | Lynq (Target) |
|---------|------------|---------|--------|-----------|----------------|---------------|
| Hourly pay input | Yes | Yes | Yes | Yes | No (salary only) | Yes |
| Shift type/schedule | Basic | No | Yes | Yes | No | Yes (detailed) |
| Physical requirements | No | No | Partial | Partial | No | Yes (checklist) |
| Certification fields | No | No | No | No | No | Yes (tagged) |
| Urgency/start date | Yes | No | Yes | Yes | No | Yes |
| AI job generation | No | No | No | No | Yes | Yes (blue-collar tuned) |
| AI bias detection | No | No | No | No | Yes | Yes (blue-collar tuned) |
| Quality scoring | No | No | No | No | Yes | Yes (reweighted) |
| A/B testing | No | No | No | No | Yes | Yes |
| Mobile preview | N/A | N/A | N/A | N/A | Yes (corporate) | Yes (blue-collar) |
| Blue-collar templates | Partial | No | Yes | Yes | No | Yes (12 roles) |

**Lynq's Differentiator:** No competitor combines AI-powered job optimization with A/B testing for blue-collar hiring. Indeed has scale, Wonolo and Instawork have shift-work focus, but none offer intelligent content generation, quality scoring, and bias detection purpose-built for blue-collar roles. This is a wide-open opportunity.

---

## 4. Functional Requirements

### 4.1 Job Data Model Changes

#### Updated Job Interface

Replace and extend the current `Job` interface in `src/lib/firebase/types.ts`:

```typescript
// ─── New blue-collar types ─────────────────────────────────────

export type ShiftType = "day" | "night" | "swing" | "rotating" | "flexible";
export type Urgency = "immediate" | "within_week" | "within_month" | "flexible";
export type PayFrequency = "weekly" | "biweekly" | "monthly";

export interface Job extends BaseDocument {
  orgId: string;
  title: string;
  department: string;
  location: string;
  locationType: "onsite" | "remote" | "hybrid";
  type: JobType;
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

  // ─── Blue-collar compensation (replaces salaryMin/salaryMax) ──
  hourlyPayMin: number | null;
  hourlyPayMax: number | null;
  overtimeRate: number | null;          // e.g., 1.5 (time-and-a-half)
  payFrequency: PayFrequency;
  currency: string;

  // ─── Shift & schedule ────────────────────────────────────────
  shiftType: ShiftType | null;
  shiftSchedule: string;                // e.g., "Mon-Fri 6am-2pm"
  startDate: Timestamp | null;          // When the role starts
  urgency: Urgency;

  // ─── Physical & certification requirements ───────────────────
  physicalRequirements: string[];       // e.g., ["Lift 50lbs", "Stand 8+ hours"]
  certifications: string[];            // e.g., ["CDL Class A", "OSHA 10"]
  experienceYears: number | null;       // Years of hands-on experience
  transportRequired: boolean;

  // ─── AI & Quality scoring (unchanged) ────────────────────────
  qualityScore?: number;
  qualityBreakdown?: QualityBreakdown;
  aiGenerated?: boolean;
  aiOptimizedFields?: string[];

  // ─── Lifecycle (unchanged) ───────────────────────────────────
  templateId?: string;
  scheduledPublishAt?: Timestamp;
  closedReason?: string;
  closedAt?: Timestamp;

  // ─── Deprecated (remove in migration) ────────────────────────
  // salaryMin — replaced by hourlyPayMin
  // salaryMax — replaced by hourlyPayMax
  // hook — removed; blue-collar candidates scan, not read
  // experienceLevel — replaced by experienceYears
}
```

#### Updated QualityBreakdown

Replace the white-collar scoring dimensions:

```typescript
export interface QualityBreakdown {
  payTransparency: number;       // 30% weight
  shiftClarity: number;          // 25% weight
  requirementsClarity: number;   // 20% weight
  locationLogistics: number;     // 15% weight
  readability: number;           // 10% weight
}
```

#### Updated JobTemplate Categories

```typescript
export type TemplateCategory =
  | "warehouse"
  | "construction"
  | "manufacturing"
  | "trades"
  | "food_service"
  | "driving"
  | "healthcare"
  | "retail"
  | "custom";
```

### 4.2 Job Editor Form Redesign

#### New Form Sections (in order)

**Section 1: Job Basics**
- Job title input (with AI optimize button)
- Department selector
- Location input with address

**Section 2: Pay & Compensation**
- Hourly rate range: min/max inputs with `$/hr` suffix
- Overtime rate selector: "None," "1.5x (time-and-a-half)," "2x (double time)," custom
- Pay frequency: radio group — "Weekly," "Biweekly," "Monthly"
- Benefits: toggleable badges
  - Blue-collar default options: "Overtime Pay," "Weekly Pay," "Sign-on Bonus," "Tool Allowance," "PPE Provided," "Steel-toe Boots Provided," "Union," "Health Insurance," "Dental Insurance," "401k," "Paid Time Off," "Holiday Pay," "Training Provided"

**Section 3: Shift & Schedule**
- Shift type: segmented control — Day / Night / Swing / Rotating / Flexible
- Schedule: text input with placeholder "e.g., Mon-Fri 6am-2pm, 4 on / 3 off"
- Start date: date picker (with "ASAP" shortcut button)
- Urgency: selector — "Hiring Immediately" / "Within 1 Week" / "Within 30 Days" / "Flexible Timeline"

**Section 4: Requirements**
- Physical requirements: checklist of common options + custom text input
  - Common options: "Lift 25lbs," "Lift 50lbs," "Lift 75lbs+," "Stand 8+ hours," "Walk/move constantly," "Work outdoors," "Work in cold/hot environments," "Climb ladders," "Repetitive motions," "Operate heavy machinery"
- Certifications: tag input with autocomplete suggestions
  - Common suggestions: "CDL Class A," "CDL Class B," "OSHA 10," "OSHA 30," "Forklift Certified," "EPA 608," "First Aid/CPR," "Welding (AWS)," "Electrical License," "Plumbing License," "HVAC Certification," "Food Handler's Card," "ServSafe," "CNA," "HHA"
- Experience: number input — "Years of experience" (0 = no experience needed)
- Transport required: toggle switch — "Personal vehicle required?"

**Section 5: Description**
- Full description textarea (with AI optimize button + bias detector)
- AI guidance text: "Write in plain language. Use bullet points. Describe what they will actually do each day."
- Character/readability indicator showing grade level

**Section 6: Tags / Skills**
- Tag input (unchanged behavior, updated placeholder: "e.g., Forklift, Welding, HVAC...")

#### Removed Fields
- `hook` — removed entirely (blue-collar candidates do not read hooks; pay/shift/location serve this purpose)
- `experienceLevel` dropdown — replaced by `experienceYears` number input
- `salaryMin/salaryMax` — replaced by `hourlyPayMin/hourlyPayMax`
- Benefits options: remove "Remote," "Equity," "Learning Budget," "Unlimited PTO"

### 4.3 Mobile Preview Redesign

The preview card must match how blue-collar candidates browse on their phone. Layout from top to bottom:

```
+---------------------------------------+
|  [Company Logo]  Company Name         |
|  Location (with distance if possible) |
+---------------------------------------+
|                                       |
|    $22 - $26 /hr                      |  <-- Large, bold, prominent
|    + Overtime: 1.5x after 40hrs       |
|    Weekly Pay                         |
|                                       |
+---------------------------------------+
|  Job Title                            |
+---------------------------------------+
|  Quick Facts:                         |
|  [Day Shift] [Mon-Fri 6am-2pm]       |
|  [Start: ASAP] [Vehicle Required]    |
+---------------------------------------+
|  Physical Requirements:               |
|  [Lift 50lbs] [Stand 8+ hrs]         |
|  [Work Outdoors]                      |
+---------------------------------------+
|  Certifications:                      |
|  [OSHA 10] [Forklift]                |
+---------------------------------------+
|  Benefits:                            |
|  [Health Insurance] [PPE Provided]    |
|  [Sign-on Bonus: $500]               |
+---------------------------------------+
|  Description (truncated, bullets):    |
|  * Load and unload delivery trucks    |
|  * Operate pallet jacks and forklifts |
|  * Maintain clean warehouse floor     |
+---------------------------------------+
|                                       |
|  [========= APPLY NOW =========]     |
|    or Call: (555) 123-4567            |
|                                       |
+---------------------------------------+
```

Key design principles:
- Pay rate is the first piece of data a candidate sees after company name
- No paragraphs — everything is badges, icons, or bullet points
- "Apply Now" button is large and high-contrast
- Total scan time target: under 5 seconds for key info

### 4.4 AI Generation & Optimization

#### Updated System Prompts

All AI system prompts in `functions/src/ai/prompts.ts` must be rewritten:

**Generate prompt:**
```
You are a job listing writer for blue-collar and trades positions on Lynq, a mobile job platform.

Rules:
- Write at an 8th-grade reading level. Short sentences. Simple words.
- NO corporate buzzwords. No "passionate," "dynamic," "synergy," "fast-paced environment."
- Use bullet points, not paragraphs, for descriptions.
- Focus on: what you will do each day, what you need to have, what you get paid.
- Be specific: "Unload delivery trucks using pallet jack" not "Support logistics operations."
- Physical requirements must be honest and specific.
- Certifications must be real and relevant to the trade.
- Hourly pay must be realistic for the role, location, and experience level.
- Benefits should be blue-collar relevant (overtime, weekly pay, PPE, tools, sign-on bonus).

Return ONLY valid JSON matching the exact schema provided.
```

**Optimize prompt:**
```
You optimize a single field of a blue-collar job listing for clarity and candidate engagement.

Rules:
- Simple language only. No jargon. Short sentences.
- Be specific and practical, not aspirational.
- If optimizing description: use bullet points, focus on daily tasks.
- If optimizing title: keep it recognizable to trades workers (not creative/clever).
- If optimizing requirements: separate true requirements from nice-to-haves.

Return ONLY valid JSON: { "optimizedValue": "...", "reasoning": "...", "confidenceScore": 0.0-1.0 }
```

**Score prompt (AI portion):**
```
Analyze this blue-collar job listing for quality. Return JSON with:
{
  "readability": <0-100>,
  "suggestions": [{ "field": "...", "message": "...", "impact": "high"|"medium"|"low" }]
}

Readability: Is the language simple? Are sentences short? Is it free of corporate jargon? Would a candidate scanning on their phone understand it in 10 seconds?

Provide 2-5 actionable suggestions. Common issues:
- Missing hourly pay rate
- Vague shift information
- Corporate language in a blue-collar listing
- Missing physical requirements
- Unnecessary education requirements
```

**Bias prompt (blue-collar focused):**
```
Analyze this blue-collar job listing for biased or exclusionary language.
Return a JSON array of issues. Each issue:
{
  "text": "<exact problematic phrase>",
  "type": "age"|"gender"|"education"|"physical"|"immigration"|"overqualification",
  "suggestion": "<specific alternative>",
  "severity": "high"|"medium"|"low"
}

Blue-collar specific bias patterns:
- Age: "young and energetic," "digital native," "recent graduate" — high severity
- Gender: "manpower," "craftsman," "lineman" — use gender-neutral alternatives
- Education: requiring college degree for manual labor roles — high severity
- Physical: ability assumptions beyond actual job needs (e.g., requiring lifting for desk-adjacent roles)
- Immigration: language hinting at citizenship requirements beyond legal necessity
- Overqualification: "entry-level" with 5+ years experience required

Return ONLY a JSON array (empty if no issues found).
```

#### Updated Generate Input Schema

Replace the current generate function input:

```typescript
// Current (white-collar)
{ title, department, level, location, keyRequirements[] }

// New (blue-collar)
{
  title: string;
  department: string;
  location: string;
  shiftType: ShiftType;
  experienceYears: number;
  tradeCategory: TemplateCategory;   // helps AI understand context
}
```

#### Updated Generate Output Schema

```typescript
{
  title: string;
  description: string;               // bullet-point format
  requirements: string[];
  physicalRequirements: string[];
  certifications: string[];
  benefits: string[];
  skills: string[];
  hourlyPayRange: {
    min: number;
    max: number;
    currency: string;
  };
  shiftSchedule: string;
  experienceYears: number;
}
```

### 4.5 Quality Scoring Redesign

Replace the current scoring system in `src/lib/utils/job-scoring.ts`:

#### New Score Breakdown (0-100)

| Dimension | Weight | Criteria |
|-----------|--------|----------|
| **Pay Transparency** | 30% | Hourly rate range stated (20pts), overtime mentioned (5pts), pay frequency stated (5pts) |
| **Shift Clarity** | 25% | Shift type selected (10pts), schedule string provided (10pts), start date set (5pts) |
| **Requirements Clarity** | 20% | Physical requirements listed (8pts), certifications if applicable (6pts), experience years stated (6pts) |
| **Location & Logistics** | 15% | Full address/area provided (10pts), transport requirement stated (5pts) |
| **Readability** | 10% | Simple language (4pts), short sentences (3pts), no jargon (3pts) |

#### Updated Local Scoring Functions

```
computePayTransparency(job): 0-100
  - hourlyPayMin AND hourlyPayMax set? +60
  - overtimeRate set? +20
  - payFrequency set (not default)? +20

computeShiftClarity(job): 0-100
  - shiftType selected (not null)? +40
  - shiftSchedule non-empty? +40
  - startDate set? +20

computeRequirementsClarity(job): 0-100
  - physicalRequirements.length >= 2? +40
  - certifications.length >= 1 (when applicable)? +30
  - experienceYears set? +30

computeLocationLogistics(job): 0-100
  - location non-empty? +65
  - transportRequired explicitly set (true or false)? +35

computeReadability(text): 0-100  (AI-assisted)
  - Average sentence length <= 15 words? +40
  - No jargon terms found? +30
  - Uses bullet points? +30
```

#### Updated Score Display

The quality score panel (`job-quality-score.tsx`) must update its dimension labels and weights:

```
Job Quality Score         78/100
|===================   | Good

Pay Transparency    ████████████  95    30%
Shift Clarity       ██████████    85    25%
Requirements        ████████░░░░  65    20%
Location/Logistics  ██████████    90    15%
Readability         ██████░░░░░░  55    10%

-- Suggestions (3) --
* Add overtime rate to improve pay transparency (+5)
* Specify required certifications (+8)
* Shorten description sentences to under 15 words (+3)
```

### 4.6 Templates

Replace all system templates in `src/lib/data/system-templates.ts` with blue-collar roles:

| Template | Category | Default Shift | Typical Pay | Key Certs |
|----------|----------|---------------|-------------|-----------|
| Warehouse Associate | warehouse | Day/Night | $16-20/hr | Forklift (optional) |
| Forklift Operator | warehouse | Day/Night | $18-24/hr | Forklift Certified |
| CNC Machinist | manufacturing | Day/Swing | $22-32/hr | CNC Programming |
| Electrician (Journeyman) | trades | Day | $28-42/hr | Electrical License |
| Electrician (Apprentice) | trades | Day | $16-22/hr | None |
| Plumber | trades | Day | $25-38/hr | Plumbing License |
| Line Cook | food_service | Swing/Night | $15-20/hr | Food Handler's Card |
| Prep Cook | food_service | Day/Swing | $14-18/hr | Food Handler's Card |
| Construction Laborer | construction | Day | $18-25/hr | OSHA 10 |
| CDL Truck Driver | driving | Varies | $22-30/hr | CDL Class A |
| HVAC Technician | trades | Day | $24-36/hr | EPA 608, HVAC Cert |
| Welder | manufacturing | Day/Night | $20-32/hr | AWS Welding Cert |
| Retail Associate | retail | Flexible | $14-18/hr | None |
| Home Health Aide | healthcare | Flexible | $15-22/hr | CNA or HHA |

Each template must include:
- Realistic hourly pay range for the role
- Common physical requirements
- Required and optional certifications
- Typical shift type and schedule
- Blue-collar specific benefits
- Bullet-point description of daily tasks

#### Updated Template Interface

```typescript
export interface SystemTemplate {
  readonly id: string;
  readonly name: string;
  readonly category: TemplateCategory;
  readonly icon: string;
  readonly fields: {
    readonly title: string;
    readonly department: string;
    readonly description: string;
    readonly requirements: readonly string[];
    readonly physicalRequirements: readonly string[];
    readonly certifications: readonly string[];
    readonly benefits: readonly string[];
    readonly skills: readonly string[];
    readonly type: "full-time" | "part-time" | "contract" | "temporary";
    readonly shiftType: ShiftType;
    readonly shiftSchedule: string;
    readonly hourlyPayMin: number;
    readonly hourlyPayMax: number;
    readonly overtimeRate: number | null;
    readonly payFrequency: PayFrequency;
    readonly experienceYears: number;
    readonly transportRequired: boolean;
    readonly urgency: Urgency;
  };
}
```

### 4.7 Bias Detection Updates

Update the bias detector constants and AI prompt in `src/lib/utils/job-scoring.ts` and `functions/src/ai/prompts.ts`:

#### Updated JARGON_WORDS (Blue-Collar Context)

Replace corporate jargon list with terms that should not appear in blue-collar listings:

```typescript
export const JARGON_WORDS: readonly string[] = [
  "synergy", "leverage", "pivot", "disrupt", "bandwidth",
  "circle back", "deep dive", "move the needle", "paradigm shift",
  "scalable", "agile", "10x", "best-in-class", "world-class",
  "cutting-edge", "passionate about", "self-starter", "go-getter",
  "dynamic environment", "fast-paced", "wear many hats",
  "hit the ground running", "rockstar", "ninja", "guru",
  "think outside the box", "results-driven", "proactive",
  "stakeholder", "deliverables", "KPIs", "mission-driven",
  "culture fit", "disruptive", "innovative mindset",
] as const;
```

#### Updated GENDERED_TERMS (Blue-Collar Context)

Add trade-specific gendered language:

```typescript
export const GENDERED_TERMS: readonly string[] = [
  "manpower", "mankind", "chairman", "salesman", "saleswoman",
  "stewardess", "fireman", "policeman", "craftsman", "spokesman",
  "lineman", "foreman", "journeyman", "handyman", "repairman",
  "workman", "draftsman", "he/she", "his/her", "guys", "you guys",
  "manhole", "man-hours",
] as const;
```

Note: Some trades use terms like "journeyman" as official license categories. The bias detector should flag these with a "low" severity and suggest alternatives like "journey-level" while acknowledging the official term may be required for certification references.

#### New Bias Categories

Add blue-collar specific checks:

```typescript
export const EDUCATION_BIAS_TERMS: readonly string[] = [
  "bachelor's degree", "college degree", "university degree",
  "master's degree", "MBA", "higher education",
  "degree required", "degree preferred",
] as const;

export const AGE_BIAS_TERMS: readonly string[] = [
  "young and energetic", "digital native", "recent graduate",
  "young professional", "fresh out of school", "youthful",
  "high energy", "tech-savvy generation",
] as const;
```

### 4.8 Analytics Updates

The analytics funnel and performance metrics remain structurally the same but relabel to blue-collar context:

```
Impressions  -->  Card Views  -->  Detail Views  -->  Applies
   12,450         4,230 (34%)      1,890 (45%)      312 (16.5%)
```

New recommendation types for underperforming blue-collar jobs:
- "Your hourly rate is below market average for [role] in [location]. Consider increasing."
- "Jobs with specific shift schedules get 40% more applies. Add your shift schedule."
- "Adding a sign-on bonus badge increases apply rate by 25%."
- "Your listing has 8 requirements. Jobs with 3-5 requirements get more applies."

---

## 5. Non-Functional Requirements

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| AI response time | < 5s for single field, < 15s for full generation | Blue-collar hiring managers have less patience for tools — speed is critical |
| Score computation | < 2s (local), < 5s (with AI) | Should feel instant in editor |
| Concurrent AI requests | 50/org/hour rate limit | Cost control |
| Data retention | Job history for 2 years after archival | Compliance |
| AI model | Claude (via Anthropic API) | Best quality for content generation |
| Caching | Cache pay benchmarks for 7 days | Reduce API costs |
| Error handling | Graceful degradation — manual editing always works | AI is enhancement, not dependency |
| Mobile preview accuracy | Match actual candidate-facing card within 95% fidelity | Hiring managers must trust the preview |
| Form load time | < 1s for editor page | Fast access for repeat posters |
| Migration safety | Zero data loss during schema migration | Existing jobs must remain accessible |
| Readability target | Flesch-Kincaid grade level <= 8 for AI-generated content | Blue-collar audience optimization |

---

## 6. Acceptance Criteria

### P0 — Must Have for Launch

- [ ] Job data model supports hourly pay (min/max), overtime rate, and pay frequency
- [ ] Job data model supports shift type, shift schedule, and start date
- [ ] Job data model supports physical requirements array and certifications array
- [ ] Job data model supports urgency level and transport required flag
- [ ] Job editor form has pay section with hourly rate inputs and overtime rate
- [ ] Job editor form has shift section with type selector and schedule input
- [ ] Job editor form has physical requirements checklist with common options
- [ ] Job editor form has certifications tag input with autocomplete
- [ ] Job editor form has blue-collar benefits badges (replacing corporate ones)
- [ ] Job editor form removes hook field entirely
- [ ] Job editor form replaces salary fields with hourly pay fields
- [ ] Mobile preview shows pay rate large and prominent at top
- [ ] Mobile preview shows quick-facts strip (shift, start date, transport)
- [ ] Mobile preview has prominent "Apply Now" button
- [ ] AI generation produces 8th-grade reading level content
- [ ] AI generation uses bullet-point format for descriptions
- [ ] AI generation avoids corporate buzzwords
- [ ] Quality score dimensions reweighted: pay transparency 30%, shift clarity 25%, requirements clarity 20%, location 15%, readability 10%
- [ ] Quality score checks hourly pay, shift, physical reqs, and certs
- [ ] Bias detection flags unnecessary education requirements as high severity
- [ ] Bias detection flags age-discriminatory language
- [ ] Bias detection flags trade-specific gendered language
- [ ] All 6 corporate templates replaced with 12+ blue-collar templates
- [ ] AI prompts rewritten for blue-collar context
- [ ] Existing jobs with old schema fields remain readable (backward compatibility)

### P1 — Fast Follow

- [ ] Start date picker with "ASAP" shortcut button
- [ ] Urgency badge displayed on mobile preview and listing
- [ ] Physical requirements shown as icons/badges on mobile preview
- [ ] Certifications shown as compact badges on mobile preview
- [ ] Experience years input replaces experience level dropdown
- [ ] Pay frequency shown on mobile preview
- [ ] "Call to Apply" alternative action on mobile preview
- [ ] AI suggests missing practical info during editing (pay, shift, physical reqs)
- [ ] Bias detection flags physical ability assumptions beyond job requirements
- [ ] Bias detection flags immigration status hints
- [ ] Template pay ranges are region-aware (adjust by location)
- [ ] Readability indicator on description field showing grade level
- [ ] Analytics recommendations are blue-collar specific

### P2 — Future Enhancements

- [ ] Pay benchmarking against market data for blue-collar roles by region
- [ ] Multi-location support (same job, multiple sites)
- [ ] Shift differential pay configuration (night shift premium)
- [ ] Seasonal/temporary job support with contract end dates
- [ ] SMS-based apply flow (common in blue-collar)
- [ ] QR code generation for job site posting
- [ ] Spanish language support for listings
- [ ] Integration with union job boards
- [ ] Bulk posting for staffing agencies

---

## 7. Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Existing jobs with `salaryMin/salaryMax` but no `hourlyPayMin/hourlyPayMax` | Migration script converts salary to estimated hourly (salary / 2080). Show "Migrated — please verify" badge on editor. |
| Existing jobs with `hook` field populated | Store value in `description` as a prepended paragraph. Show migration notice. |
| Existing jobs with `experienceLevel` but no `experienceYears` | Map: entry=0, mid=2, senior=5, lead=8, executive=10. Show "Migrated — please verify." |
| Job with no physical requirements (e.g., retail cashier) | Allow empty array. Quality score does not penalize if job category typically has no physical demands. |
| Template category does not match any blue-collar category | Default to "custom" category. |
| AI generates content with corporate language despite new prompts | Run jargon check on AI output before showing to user. Flag and re-prompt if jargon count > 2. |
| Hiring manager enters salary instead of hourly rate | Validate input range. If value > 100, show tooltip: "This field is for hourly rate. Did you mean to enter an annual salary?" |
| Certifications that are not in the autocomplete list | Allow free-text entry. Autocomplete is a convenience, not a restriction. |
| Overtime rate varies by day (weekday vs. weekend) | Phase 1: single overtime rate. Flag for future multi-tier overtime support. |
| Job is both onsite and requires travel between sites | Allow location field to contain multiple addresses or "Multiple locations — [city]" format. |
| User switches between old and new editor (during migration) | Old editor is read-only for migrated jobs. Force new editor for all new jobs. |
| AI bias detection flags an official certification name (e.g., "journeyman") | Low severity flag with note: "This is an official certification term. Consider adding the gender-neutral alternative alongside it." |

---

## 8. Out of Scope

- **Candidate-facing job search/apply UI** — Separate product, not part of this PRD
- **Job distribution to external boards** — Indeed, LinkedIn, etc. (future integration)
- **Interview scheduling** — Separate feature
- **Payroll integration** — Not part of job listing
- **Background check integration** — Separate workflow
- **Multi-language AI generation** — Phase 1 is English only (Spanish is P2)
- **Real-time collaboration** — Multiple editors on same job
- **Custom AI model fine-tuning** — Using Claude API with prompt engineering only
- **GPS-based commute estimation** — "Distance from candidate" feature is future
- **Shift bidding / shift marketplace** — Separate product concept
- **White-collar job support removal** — Existing white-collar templates and features are deprecated but not deleted; they become inaccessible in the UI unless re-enabled

---

## 9. Technical Considerations

### 9.1 Migration Strategy

This is a breaking change to the `Job` interface. Migration must be handled carefully:

**Phase 1: Schema Extension (Non-Breaking)**
1. Add all new fields as optional to the `Job` interface
2. Keep old fields (`salaryMin`, `salaryMax`, `hook`, `experienceLevel`) as deprecated optional
3. Deploy updated Firestore rules that accept both old and new fields
4. Deploy migration Cloud Function that can be triggered per-org

**Phase 2: Data Migration**
1. Run migration script on existing jobs:
   - `salaryMin` -> estimate `hourlyPayMin` (salaryMin / 2080)
   - `salaryMax` -> estimate `hourlyPayMax` (salaryMax / 2080)
   - `hook` -> prepend to `description`
   - `experienceLevel` -> map to `experienceYears`
   - Set default values: `shiftType: null`, `urgency: "flexible"`, `payFrequency: "biweekly"`, `transportRequired: false`, `physicalRequirements: []`, `certifications: []`
2. Mark migrated jobs with `_migrated: true` flag for audit trail

**Phase 3: UI Swap**
1. Deploy new editor UI behind feature flag
2. Enable for internal testing, then beta orgs, then GA
3. Old editor becomes read-only fallback

**Phase 4: Cleanup**
1. Remove deprecated fields from TypeScript interface (mark as `never`)
2. Remove old editor components
3. Clean up migration flags

### 9.2 Files That Require Changes

| File | Change Type | Scope |
|------|-------------|-------|
| `src/lib/firebase/types.ts` | **Major** | New types, updated Job interface, updated QualityBreakdown, updated JobTemplate |
| `src/components/screens/jobs/editor/job-editor-sections.tsx` | **Rewrite** | Entirely new form layout with blue-collar fields |
| `src/components/screens/jobs/job-editor-screen.tsx` | **Major** | New controlled state for all blue-collar fields, updated AI handlers |
| `src/lib/utils/job-scoring.ts` | **Rewrite** | New scoring functions, new constants, new dimensions |
| `src/lib/data/system-templates.ts` | **Rewrite** | All new templates, new interface |
| `functions/src/ai/prompts.ts` | **Rewrite** | All prompts rewritten for blue-collar |
| `src/components/screens/jobs/editor/bias-detector.tsx` | **Minor** | Component is generic; changes are in scoring utils and AI prompts |
| `src/components/screens/jobs/editor/job-quality-score.tsx` | **Moderate** | Updated dimension labels and weights |
| `src/components/screens/jobs/editor/ai-generate-modal.tsx` | **Moderate** | Updated input fields for blue-collar generation |
| `src/lib/hooks/use-job-score.ts` | **Moderate** | Wire new scoring functions |
| `src/lib/hooks/use-jobs.ts` | **Minor** | Type updates flow through |
| `src/lib/ai/types.ts` | **Moderate** | Updated AI field names and schemas |
| `firestore.rules` | **Minor** | Allow new fields |
| `scripts/seed-firestore.ts` | **Moderate** | Seed blue-collar test data |

### 9.3 Architecture Alignment

The implementation builds on existing patterns with no architectural changes:

| Layer | Existing Pattern | Extension |
|-------|-----------------|-----------|
| **Data** | `Job` interface in `types.ts` | Add blue-collar fields, deprecate white-collar fields |
| **Hooks** | TanStack Query hooks in `src/lib/hooks/` | Update type signatures, same query patterns |
| **UI** | Controlled form in `job-editor-sections.tsx` | New sections, same controlled form pattern |
| **Backend** | Firebase Functions with Claude API | Same functions, updated prompts and schemas |
| **State** | Firestore documents | Same collections, extended document schema |
| **Scoring** | Pure functions in `job-scoring.ts` | New pure functions, same testing pattern |
| **Templates** | Readonly array in `system-templates.ts` | New entries, updated interface |

### 9.4 Cost Estimation

| Operation | Est. Tokens | Cost (Claude) | Frequency |
|-----------|------------|---------------|-----------|
| Full generation | ~3,000 (simpler content) | ~$0.09 | 5-10/day/org |
| Field optimization | ~1,000 | ~$0.03 | 20-30/day/org |
| Quality scoring (AI portion) | ~1,500 | ~$0.05 | 10-20/day/org |
| Bias detection | ~800 | ~$0.02 | 10-20/day/org |
| **Daily est./org** | | **~$2-6** | |

Cost is slightly lower than white-collar because blue-collar content is shorter and simpler.

---

## 10. Success Metrics

| Metric | Baseline (Current) | Target (3 months) | Target (6 months) |
|--------|-------------------|-------------------|-------------------|
| Avg. time to create job listing | ~45 min | 10 min | 5 min |
| Avg. job quality score | N/A | 75 | 85 |
| Avg. apply rate | 2.1% | 3.5% | 5.0% |
| % listings with hourly pay stated | 0% (salary field) | 90% | 98% |
| % listings with shift info complete | 0% | 80% | 95% |
| % listings with physical requirements | 0% | 70% | 90% |
| % jobs using AI features | 0% | 50% | 75% |
| Avg. Flesch-Kincaid grade level (AI content) | ~12 (corporate) | 8 | 7 |
| Blue-collar template usage rate | 0% | 40% | 60% |
| Bias issues per listing (avg) | Unknown | <2 | <1 |
| Time-to-first-apply (from publish) | Unknown | <4 hours | <2 hours |

---

## 11. Implementation Plan

### Phase 1: Data Model & Types (Week 1)
**Goal:** Establish the blue-collar data foundation.

- Update `Job` interface in `types.ts` with all new fields (keep old as deprecated)
- Update `QualityBreakdown` interface with new dimensions
- Update `JobTemplate` interface and `TemplateCategory` type
- Update `SystemTemplate` interface
- Update Firestore rules to accept new fields
- Write migration utility functions (salary-to-hourly, level-to-years, hook-to-description)
- Update seed script with blue-collar test data
- **Tests:** Unit tests for migration utils, type compatibility tests

### Phase 2: Scoring & Bias (Week 2)
**Goal:** Get the quality feedback loop working with blue-collar criteria.

- Rewrite `job-scoring.ts` with new scoring functions (payTransparency, shiftClarity, requirementsClarity, locationLogistics, readability)
- Update jargon and gendered terms lists
- Add education bias and age bias term lists
- Update `use-job-score.ts` hook to use new functions
- Update `job-quality-score.tsx` component with new dimension labels
- **Tests:** Unit tests for all scoring functions with blue-collar job fixtures

### Phase 3: Templates & AI Prompts (Week 3)
**Goal:** Content generation is blue-collar native.

- Rewrite all system templates in `system-templates.ts` (14 templates)
- Rewrite all AI prompts in `functions/src/ai/prompts.ts`
- Update AI generate/optimize function input/output schemas
- Update `ai-generate-modal.tsx` input fields for blue-collar
- Update `use-ai-jobs.ts` hooks for new schemas
- **Tests:** Integration tests for AI generation with blue-collar inputs

### Phase 4: Editor UI (Weeks 4-5)
**Goal:** Hiring managers can create blue-collar listings end to end.

- Rewrite `job-editor-sections.tsx` with all new form sections
- Add new UI components: shift type selector, physical requirements checklist, certifications autocomplete, pay frequency selector, urgency selector
- Update `job-editor-screen.tsx` controlled state for all new fields
- Wire AI optimize buttons to new fields
- Wire bias detector to description
- Remove hook field, old salary fields, experience level dropdown
- Update benefits options to blue-collar defaults
- **Tests:** Component tests for new form sections, integration test for full editor flow

### Phase 5: Mobile Preview (Week 6)
**Goal:** Preview matches the blue-collar candidate experience.

- Redesign `JobEditorPreviewCard` with blue-collar layout
- Pay rate large and prominent
- Quick-facts strip with badges
- Physical requirements as compact badges
- Certifications as badges
- Large "Apply Now" button
- **Tests:** Visual regression tests for preview at various data states

### Phase 6: Migration & Rollout (Week 7)
**Goal:** Existing data migrated safely, feature flag rollout.

- Build migration Cloud Function
- Run migration on staging data, verify integrity
- Deploy behind feature flag
- Internal testing (1 week)
- Beta org rollout (1 week)
- General availability
- Monitor quality scores, creation time, error rates

### Phase 7: Polish & Analytics (Week 8)
**Goal:** Blue-collar specific analytics and recommendation engine.

- Update analytics recommendations for blue-collar context
- Add blue-collar specific underperformance suggestions
- Performance monitoring and optimization
- Documentation updates
- Old editor cleanup (behind flag)

---

## 12. Open Questions

- [ ] Should we support shift differential pay (night shift premium) in Phase 1 or defer to Phase 2?
- [ ] Do we need a "Call to Apply" phone number field, or is apply-through-app sufficient for launch?
- [ ] Should the urgency badge auto-expire (e.g., "Hiring Immediately" becomes "Still Hiring" after 2 weeks)?
- [ ] How do we handle jobs that straddle blue-collar and white-collar (e.g., field service engineer)? Do we need a "job category" selector?
- [ ] Should we keep the A/B testing system as-is, or should we create blue-collar specific test variables (e.g., test pay rate impact, test shift description wording)?
- [ ] What is the migration plan for orgs that have active white-collar job listings? Do they keep using the old editor for existing jobs?
- [ ] Do we need FLSA compliance validation (overtime eligibility based on hourly/salary classification)?

---

*Generated by Lynq Product Management -- Blue-Collar Pivot v1.0*
