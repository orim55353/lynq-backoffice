# Users Collection

**Path:** `users/{userId}`

The `userId` matches the Firebase Auth UID. Created on first sign-in.

## Schema

| Field               | Type      | Required | Description                          |
|---------------------|-----------|----------|--------------------------------------|
| `uid`               | `string`  | Yes      | Firebase Auth UID (matches doc ID)   |
| `email`             | `string`  | Yes      | User email                           |
| `displayName`       | `string`  | Yes      | Full name                            |
| `photoURL`          | `string?` | No       | Profile photo URL                    |
| `activeOrgId`       | `string?` | No       | Currently selected organization      |
| `onboardingComplete`| `boolean` | Yes      | Whether user finished onboarding     |
| `createdAt`         | `Timestamp`| Yes     | Account creation time                |
| `updatedAt`         | `Timestamp`| Yes     | Last profile update                  |

## Security Rules

- Any authenticated user can read user profiles
- Users can only create/update their own document
- Deletion is not permitted (soft-delete via status field if needed)

## Example Document

```json
{
  "uid": "abc123",
  "email": "jane@techcorp.com",
  "displayName": "Jane Doe",
  "photoURL": null,
  "activeOrgId": "org_techcorp",
  "onboardingComplete": true,
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-03-01T14:30:00Z"
}
```
