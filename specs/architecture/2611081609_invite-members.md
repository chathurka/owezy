# Architecture: Invite members

**Status:** approved
**GitHub Issue:** #135 — https://github.com/chathurka/owezy/issues/135
**Feature Spec:** `specs/features/2611081609_invite-members.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611081609_invite-members.yaml`
**Design:** https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web?node-id=1-1257, https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-380 `(adapted — invite panel on overview)`

---

## Scope

`group_invitations` + create/list/revoke APIs and invite UI on overview. Accept is E03-S04.

## NestJS

| Method | Path | Notes |
|--------|------|-------|
| POST | `/v1/groups/:groupId/invitations` | Client UUID; returns token once |
| GET | `/v1/groups/:groupId/invitations` | List for members |
| POST | `/v1/groups/:groupId/invitations/:invitationId/revoke` | Pending only |

## Data model

`group_invitations`: id, group_id, invited_by, email nullable, token_hash, status, expires_at, timestamps, deleted_at.

## Clients

Invite section on group overview: show inviteCode + create invitation button + list pending.

## Build Order

Migration → API → clients

## AI Resolutions

- TTL 604800s (7d); token 32-byte hex; SHA-256 hash.
- Member or owner may invite.
