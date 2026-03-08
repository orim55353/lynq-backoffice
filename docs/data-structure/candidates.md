# Candidates Collection

**Path:** `candidates/{candidateId}`

Candidate profiles associated with organizations. A candidate can have multiple applications to different jobs.

## Schema

| Field            | Type       | Required | Description                           |
|------------------|------------|----------|---------------------------------------|
| `orgId`          | `string`   | Yes      | Parent organization                   |
| `name`           | `string`   | Yes      | Full name                             |
| `email`          | `string`   | Yes      | Email address                         |
| `phone`          | `string`   | Yes      | Phone number                          |
| `location`       | `string`   | Yes      | Location text                         |
| `linkedinURL`    | `string`   | Yes      | LinkedIn profile URL                  |
| `resumeURL`      | `string?`  | No       | Cloud Storage path to resume          |
| `avatarURL`      | `string?`  | No       | Profile photo URL                     |
| `currentCompany` | `string`   | Yes      | Current employer                      |
| `currentRole`    | `string`   | Yes      | Current job title                     |
| `experienceYears`| `number`   | Yes      | Years of experience                   |
| `skills`         | `string[]` | Yes      | Skill tags                            |
| `availability`   | `string`   | Yes      | Notice period / availability          |
| `source`         | `string`   | Yes      | `direct` / `linkedin` / `referral` / `agency` / `other` |
| `tags`           | `string[]` | Yes      | Custom tags for filtering             |
| `createdAt`      | `Timestamp`| Yes      | Creation time                         |
| `updatedAt`      | `Timestamp`| Yes      | Last update time                      |

## Indexes

1. `orgId` ASC + `stage` ASC + `fitScore` DESC — Pipeline view sorted by fit
2. `orgId` ASC + `jobId` ASC + `appliedAt` DESC — Candidates per job
