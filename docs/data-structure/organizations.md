# Organizations Collection

**Path:** `organizations/{orgId}`

Organizations represent companies / tenants. All business data is scoped by `orgId`.

## Schema

| Field              | Type       | Required | Description                     |
|--------------------|------------|----------|---------------------------------|
| `name`             | `string`   | Yes      | Company name                    |
| `slug`             | `string`   | Yes      | URL-safe identifier             |
| `logoURL`          | `string?`  | No       | Company logo                    |
| `industry`         | `string`   | Yes      | Industry sector                 |
| `website`          | `string`   | Yes      | Company website                 |
| `plan`             | `string`   | Yes      | `free` / `pro` / `enterprise`   |
| `billingEmail`     | `string`   | Yes      | Billing contact email           |
| `settings.timezone`| `string`   | Yes      | e.g. `America/New_York`         |
| `settings.defaultCurrency` | `string` | Yes | e.g. `USD`                 |
| `settings.brandColor` | `string` | Yes    | Hex color for branding          |
| `createdAt`        | `Timestamp`| Yes      | Creation time                   |
| `updatedAt`        | `Timestamp`| Yes      | Last update time                |

## Members Subcollection

**Path:** `organizations/{orgId}/members/{userId}`

| Field         | Type       | Required | Description              |
|---------------|------------|----------|--------------------------|
| `userId`      | `string`   | Yes      | Firebase Auth UID        |
| `email`       | `string`   | Yes      | Member email             |
| `displayName` | `string`   | Yes      | Member name              |
| `role`        | `string`   | Yes      | `owner` / `admin` / `recruiter` / `viewer` |
| `invitedBy`   | `string`   | Yes      | UID of inviting user     |
| `joinedAt`    | `Timestamp`| Yes      | When they joined         |

## Roles & Permissions

| Role        | Read | Create Jobs | Manage Candidates | Admin Settings | Billing | Delete Org |
|-------------|------|-------------|-------------------|----------------|---------|------------|
| `viewer`    | Yes  | No          | No                | No             | No      | No         |
| `recruiter` | Yes  | Yes         | Yes               | No             | No      | No         |
| `admin`     | Yes  | Yes         | Yes               | Yes            | Yes     | No         |
| `owner`     | Yes  | Yes         | Yes               | Yes            | Yes     | Yes        |
