# Campaigns Collection (Sponsored)

**Path:** `campaigns/{campaignId}`

Sponsored advertising campaigns linked to job listings.

## Schema

| Field                          | Type       | Required | Description                    |
|--------------------------------|------------|----------|--------------------------------|
| `orgId`                        | `string`   | Yes      | Parent organization            |
| `jobId`                        | `string`   | Yes      | Promoted job listing           |
| `name`                         | `string`   | Yes      | Campaign name                  |
| `status`                       | `string`   | Yes      | `draft` / `active` / `paused` / `completed` / `cancelled` |
| `budget`                       | `number`   | Yes      | Total budget                   |
| `spent`                        | `number`   | Yes      | Amount spent so far            |
| `currency`                     | `string`   | Yes      | Currency code                  |
| `startDate`                    | `Timestamp`| Yes      | Campaign start                 |
| `endDate`                      | `Timestamp`| Yes      | Campaign end                   |
| `targetAudience.locations`     | `string[]` | Yes      | Target locations               |
| `targetAudience.skills`        | `string[]` | Yes      | Target skills                  |
| `targetAudience.experienceLevels` | `string[]` | Yes   | Target experience levels       |
| `metrics.impressions`          | `number`   | Yes      | Total impressions              |
| `metrics.clicks`               | `number`   | Yes      | Total clicks                   |
| `metrics.applications`         | `number`   | Yes      | Applications from campaign     |
| `metrics.ctr`                  | `number`   | Yes      | Click-through rate             |
| `metrics.costPerClick`         | `number`   | Yes      | Average CPC                    |
| `metrics.costPerApplication`   | `number`   | Yes      | Average CPA                    |
| `createdBy`                    | `string`   | Yes      | UID of creator                 |
| `createdAt`                    | `Timestamp`| Yes      | Creation time                  |
| `updatedAt`                    | `Timestamp`| Yes      | Last update time               |
