# Architecture: Accept invitation and join group

**Status:** approved
**GitHub Issue:** #136 — https://github.com/chathurka/owezy/issues/136
**Feature Spec:** `specs/features/2611081612_accept-invitation-and-join-group.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611081612_accept-invitation-and-join-group.yaml`
**Design:** https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web?node-id=1-800, https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-167 `(adapted — accept form from join-code chrome)`

---

## Scope

Accept token endpoint + client accept screens.

## Endpoint

`POST /v1/invitations/accept` JWT — hash token, validate, addMember, mark accepted.

## Clients

`/groups/accept` (web), `/groups/accept` (mobile) with token field.

## AI Resolutions

- Idempotent if already member; still marks invitation accepted if pending.
