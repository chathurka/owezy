# Architecture: Edit or archive a group

**Status:** approved
**GitHub Issue:** #138 — https://github.com/chathurka/owezy/issues/138
**Feature Spec:** `specs/features/2611081615_edit-or-archive-a-group.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611081615_edit-or-archive-a-group.yaml`
**Design:** https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-479 `(Group settings button adapted)`, https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web?node-id=1-1257

---

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| PATCH | `/v1/groups/:groupId` | Owner; name |
| POST | `/v1/groups/:groupId/archive` | Owner |

## Data

`groups.archived_at` timestamptz nullable.

## AI Resolutions

- List filters `archived_at IS NULL`.
