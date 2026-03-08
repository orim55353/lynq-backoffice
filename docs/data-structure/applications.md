# Applications Collection

**Path:** `applications/{applicationId}`

Join table between candidates and jobs. Tracks the application lifecycle.

## Schema

| Field           | Type          | Required | Description                        |
|-----------------|---------------|----------|------------------------------------|
| `orgId`         | `string`      | Yes      | Parent organization                |
| `jobId`         | `string`      | Yes      | Reference to job                   |
| `candidateId`   | `string`      | Yes      | Reference to candidate             |
| `status`        | `string`      | Yes      | `pending` / `reviewing` / `shortlisted` / `interview` / `offer` / `hired` / `rejected` / `withdrawn` |
| `stage`         | `string`      | Yes      | Pipeline stage (mirrors status)    |
| `fitScore`      | `number`      | Yes      | AI-computed fit score (0-100)      |
| `intentScore`   | `number`      | Yes      | Candidate intent score (0-100)     |
| `engagement`    | `string`      | Yes      | `high` / `medium` / `low`         |
| `appliedAt`     | `Timestamp`   | Yes      | Application submission time        |
| `lastActivity`  | `string`      | Yes      | Description of last activity       |
| `notes`         | `string`      | Yes      | Recruiter notes                    |
| `reviewedBy`    | `string?`     | No       | UID of reviewer                    |
| `interviewDates`| `Timestamp[]` | Yes      | Scheduled interview dates          |
| `offerAmount`   | `number?`     | No       | Offer salary amount                |
| `createdAt`     | `Timestamp`   | Yes      | Creation time                      |
| `updatedAt`     | `Timestamp`   | Yes      | Last update time                   |

## Indexes

1. `orgId` ASC + `jobId` ASC + `status` ASC + `createdAt` DESC — Applications per job filtered by status
