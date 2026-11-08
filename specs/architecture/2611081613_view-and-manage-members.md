# Architecture: View and manage members

**Status:** approved
**GitHub Issue:** #137 — https://github.com/chathurka/owezy/issues/137
**Feature Spec:** `specs/features/2611081613_view-and-manage-members.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611081613_view-and-manage-members.yaml`
**Design:** https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web?node-id=1-1257, https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-380 `(adapted — Members section)`

---

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/v1/groups/:groupId/members` | Membership required |
| DELETE | `/v1/groups/:groupId/members/:userId` | Owner only; soft delete |

## AI Resolutions

- Soft-delete membership via deleted_at; no hard delete.
