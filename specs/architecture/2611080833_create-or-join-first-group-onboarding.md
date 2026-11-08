# Architecture: Create or join first group onboarding

**Status:** approved
**GitHub Issue:** #131 — https://github.com/chathurka/owezy/issues/131
**Feature Spec:** `specs/features/2611080833_create-or-join-first-group-onboarding.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611080833_create-or-join-first-group-onboarding.yaml`
**Design:** `resources/owezy-web/pages/Groups.dc.html`, `resources/owezy-web/pages/SignUp.dc.html` (first group step), `resources/owezy-mobile/prototype/screens/Groups.dc.html` `(adapted — no dedicated join/onboarding mock)`

---

## Scope

Minimal GroupsModule + onboarding UI after profile setup. Admin n/a.

## NestJS `GroupsModule`

| Method | Path | Notes |
|--------|------|-------|
| POST | `/v1/groups` | Client UUID + name; creator = owner; invite_code |
| POST | `/v1/groups/join` | `{ inviteCode }` |
| GET | `/v1/groups` | List active memberships |

Also: PATCH me gains `completeGroupOnboarding` / column `group_onboarding_completed_at`.

## Data model

`groups`, `group_members` with soft deletes; client UUIDs.

## Flutter / User-web

Route `/onboarding/group` with Create / Join / Skip; after profile setup navigate here if `groupOnboardingCompletedAt` null AND groups empty (or always if flag null).

## Build Order

API → clients

## Unit tests

API create/join/list; clients submit create/join/skip.

## AI Resolutions

- Home landing not full GroupWorkspace.
- Skip sets `groupOnboardingCompletedAt`.
- Design adapted.
