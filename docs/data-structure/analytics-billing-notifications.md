# Analytics, Billing & Notifications

## Analytics Collection

**Path:** `analytics/{eventId}`

Immutable event log for tracking user interactions. Write-once, no updates or deletes.

| Field        | Type       | Required | Description                           |
|--------------|------------|----------|---------------------------------------|
| `orgId`      | `string`   | Yes      | Parent organization                   |
| `eventType`  | `string`   | Yes      | Event name (see types below)          |
| `jobId`      | `string?`  | No       | Related job                           |
| `candidateId`| `string?`  | No       | Related candidate                     |
| `userId`     | `string`   | Yes      | User who triggered the event          |
| `timestamp`  | `Timestamp`| Yes      | When the event occurred               |
| `metadata`   | `map`      | Yes      | Additional key-value data             |

### Event Types

`job_view`, `job_apply`, `job_save`, `candidate_view`, `candidate_shortlist`, `interview_schedule`, `offer_extend`, `offer_accept`, `offer_decline`

---

## Job Analytics Collection

**Path:** `jobAnalytics/{docId}`

Daily aggregated performance metrics per job. One document per job per day. Used to power overview dashboard KPI sparklines and the per-job analytics page.

| Field              | Type        | Required | Description                                      |
|--------------------|-------------|----------|--------------------------------------------------|
| `orgId`            | `string`    | Yes      | Parent organization                              |
| `jobId`            | `string`    | Yes      | Related job                                      |
| `date`             | `string`    | Yes      | Day in `YYYY-MM-DD` format                       |
| `impressions`      | `number`    | Yes      | Number of times the job was shown in feed         |
| `scrollStops`      | `number`    | Yes      | Users who paused scrolling on this job            |
| `expands`          | `number`    | Yes      | Users who expanded the job card                   |
| `applies`          | `number`    | Yes      | Applications submitted                            |
| `costPerApplicant` | `number`    | Yes      | Cost per applicant for that day (USD)             |
| `createdAt`        | `Timestamp` | Yes      | Document creation time                            |

### Indexes

1. `orgId` ASC + `date` DESC — Overview sparklines: fetch last 14–30 days across all jobs for an org
2. `orgId` ASC + `jobId` ASC + `date` DESC — Per-job analytics page: fetch daily data for a single job

### Usage

**Overview dashboard sparklines:** Query all `jobAnalytics` docs for an org (last 30 days), then aggregate client-side:
- **Active Jobs sparkline**: Count distinct `jobId`s per day
- **Total Impressions sparkline**: `SUM(impressions)` per day
- **Apply Rate sparkline**: `SUM(applies) / SUM(impressions) * 100` per day
- **Cost per Applicant sparkline**: `SUM(costPerApplicant * applies) / SUM(applies)` per day (weighted avg)
- **Change %**: Compare avg of last 7 days vs previous 7 days

**Per-job analytics page:** Query by `orgId` + `jobId`, used to compute funnel data, trend direction, health score, and recommendations.

### Data Source

**Production:** Populated nightly by the `aggregateDailyJobAnalytics` Cloud Function (runs 02:00 UTC). See `functions/src/analytics/aggregate-daily.ts`.

Current event-to-field mapping:
| jobAnalytics field  | Source                                      | Status  |
|---------------------|---------------------------------------------|---------|
| `impressions`       | Count of `job_view` analytics events        | Proxy   |
| `scrollStops`       | Future: `job_scroll_stop` events            | 0 (TBD) |
| `expands`           | Future: `job_expand` events                 | 0 (TBD) |
| `applies`           | Count of `job_apply` analytics events       | Live    |
| `costPerApplicant`  | Derived from active campaign spend / applies | Live    |

**Dev/seed:** `npm run seed` creates 180 demo docs (30 days × 6 jobs).

All hooks read from Firestore via `useFirestoreCollection<JobAnalytics>` with `orgId` constraint. See `src/lib/hooks/use-job-analytics.ts` and `src/lib/hooks/use-analytics.ts`.

---

## Billing Collection

**Path:** `billing/{orgId}`

Server-managed billing records. No direct client writes.

| Field                   | Type       | Required | Description                  |
|-------------------------|------------|----------|------------------------------|
| `orgId`                 | `string`   | Yes      | Organization (matches doc ID)|
| `plan`                  | `string`   | Yes      | Current plan                 |
| `stripeCustomerId`      | `string?`  | No       | Stripe customer ID           |
| `stripeSubscriptionId`  | `string?`  | No       | Stripe subscription ID       |
| `currentPeriodStart`    | `Timestamp`| Yes      | Billing period start         |
| `currentPeriodEnd`      | `Timestamp`| Yes      | Billing period end           |
| `invoices`              | `array`    | Yes      | Array of invoice objects     |

---

## Notifications Collection

**Path:** `notifications/{notificationId}`

Push notifications delivered to individual users. Created server-side, read/marked by clients.

| Field       | Type       | Required | Description                    |
|-------------|------------|----------|--------------------------------|
| `userId`    | `string`   | Yes      | Target user                    |
| `type`      | `string`   | Yes      | `new_application` / `interview_reminder` / `offer_response` / `campaign_update` / `system` |
| `title`     | `string`   | Yes      | Notification title             |
| `message`   | `string`   | Yes      | Notification body              |
| `read`      | `boolean`  | Yes      | Whether user has read it       |
| `actionURL` | `string?`  | No       | Deep link for navigation       |
| `metadata`  | `map`      | Yes      | Additional context             |
| `createdAt` | `Timestamp`| Yes      | Creation time                  |
