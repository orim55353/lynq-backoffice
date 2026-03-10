# Lynq Backoffice — Firestore Data Structure

## Overview

The Lynq backoffice uses Cloud Firestore as its primary database, organized around a multi-tenant model where **organizations** are the top-level entity. Every data record belongs to an organization via an `orgId` field.

## Collections at a Glance

| Collection       | Description                        | Key Fields                  |
|-----------------|------------------------------------|-----------------------------|
| `users`         | User profiles (1:1 with Auth)      | `uid`, `activeOrgId`        |
| `organizations` | Companies / tenants                | `name`, `plan`, `settings`  |
| `jobs`          | Job listings                       | `orgId`, `status`, `title`  |
| `candidates`    | Candidate profiles                 | `orgId`, `skills`, `source` |
| `applications`  | Job applications (join table)      | `orgId`, `jobId`, `candidateId` |
| `campaigns`     | Sponsored ad campaigns             | `orgId`, `jobId`, `budget`  |
| `analytics`     | Event tracking                     | `orgId`, `eventType`        |
| `jobAnalytics`  | Daily per-job performance metrics   | `orgId`, `jobId`, `date`    |
| `billing`       | Billing & subscription info        | `orgId`, `plan`, `stripe*`  |
| `notifications` | User notifications                 | `userId`, `type`, `read`    |

## Subcollections

| Parent               | Subcollection | Description           |
|----------------------|---------------|-----------------------|
| `organizations/{id}` | `members`     | Org membership & roles |

## Relationships

```
users ──┬── organizations (via members subcollection)
        │
organizations ──┬── jobs
                ├── candidates
                ├── applications (references jobId + candidateId)
                ├── campaigns (references jobId)
                ├── analytics
                ├── jobAnalytics (references jobId, daily aggregates)
                └── billing

users ── notifications
```

## Security Model

- All data is scoped by `orgId`
- Membership checked via `organizations/{orgId}/members/{userId}`
- Roles: `owner` > `admin` > `recruiter` > `viewer`
- Billing and notifications are server-managed (no direct client writes)

## TypeScript Types

All Firestore document types are defined in `src/lib/firebase/types.ts`.
