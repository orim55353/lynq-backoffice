# Jobs Collection

**Path:** `jobs/{jobId}`

Job listings created and managed by organizations.

## Schema

| Field              | Type         | Required | Description                          |
|--------------------|--------------|----------|--------------------------------------|
| `orgId`            | `string`     | Yes      | Parent organization                  |
| `title`            | `string`     | Yes      | Job title                            |
| `department`       | `string`     | Yes      | Department name                      |
| `location`         | `string`     | Yes      | Location text                        |
| `locationType`     | `string`     | Yes      | `onsite` / `remote` / `hybrid`       |
| `type`             | `string`     | Yes      | `full-time` / `part-time` / `contract` / `internship` / `temporary` |
| `experienceLevel`  | `string`     | Yes      | `entry` / `mid` / `senior` / `lead` / `executive` |
| `salaryMin`        | `number?`    | No       | Minimum salary                       |
| `salaryMax`        | `number?`    | No       | Maximum salary                       |
| `currency`         | `string`     | Yes      | Currency code (e.g. `USD`)           |
| `description`      | `string`     | Yes      | Rich-text job description            |
| `requirements`     | `string[]`   | Yes      | List of requirements                 |
| `benefits`         | `string[]`   | Yes      | List of benefits                     |
| `skills`           | `string[]`   | Yes      | Required skills tags                 |
| `status`           | `string`     | Yes      | `draft` / `active` / `paused` / `closed` / `archived` |
| `publishedAt`      | `Timestamp?` | No       | When published                       |
| `closesAt`         | `Timestamp?` | No       | Application deadline                 |
| `createdBy`        | `string`     | Yes      | UID of creator                       |
| `viewCount`        | `number`     | Yes      | Total views                          |
| `applicationCount` | `number`     | Yes      | Total applications                   |
| `createdAt`        | `Timestamp`  | Yes      | Creation time                        |
| `updatedAt`        | `Timestamp`  | Yes      | Last update time                     |

## Indexes

1. `orgId` ASC + `status` ASC + `createdAt` DESC — List jobs by org and status
2. `orgId` ASC + `department` ASC — Filter by department
