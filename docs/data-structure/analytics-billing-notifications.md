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
