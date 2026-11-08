# Architecture: Create a group

**Status:** approved
**GitHub Issue:** #133 — https://github.com/chathurka/owezy/issues/133
**Feature Spec:** `specs/features/2611081557_create-a-group.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611081557_create-a-group.yaml`
**Design:** https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web?node-id=1-800 (02 · Groups iframe), https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-167 (Groups iframe) `(adapted — no exact Create Group mock; New group CTA + onboarding create form)`

---

## Scope

Extend GroupsModule create for idempotency; add Groups list + Create Group screens on user-web and mobile. Admin n/a.

## Architecture Overview

```
Client (web/mobile Create Group form)
  → BFF / Dio POST /v1/groups {id, name}
  → GroupsService.create (idempotent by id)
  → GroupRepository.findById | createGroup
  → navigate to Groups list (GET /v1/groups)
```

## Key Design Decisions

- Idempotency on client UUID PK; conflict if id owned by another user.
- Reuse existing invite_code generation and owner membership.
- Minimal Groups list UI in this story so created group is visible; richer overview in E03-S02.

## NestJS module design

### Module: `GroupsModule` (extend)

| Layer | File | Responsibility |
|-------|------|----------------|
| Controller | `groups.controller.ts` | Unchanged paths |
| Service | `groups.service.ts` | Idempotent create |
| Repository | `group.repository*.ts` | `findById` |

**Endpoints:**

| Method | Path | Guard | DTO in | Response |
|--------|------|-------|--------|----------|
| POST | `/v1/groups` | JWT | CreateGroupDto | Group (201) |
| GET | `/v1/groups` | JWT | — | `{ items }` (existing) |

## Data model

No schema change. Use existing `groups` / `group_members`.

## Auth / authorization

JWT user role. Create always attaches creator as owner.

## Flutter feature design

- Add `list` to `GroupsRemoteDataSource`.
- Domain/repo/usecases: `CreateGroupUseCase`, `ListGroupsUseCase`.
- Routes: `/groups`, `/groups/create`.
- Controllers: `GroupsListController`, `CreateGroupController` (stable UUID in controller for retries).
- UI: Groups list with New CTA; create form matching auth field/button chrome + Figma New button.

## Next.js user-web screen inventory

| Route | Purpose |
|-------|---------|
| `/groups` | List groups + New group |
| `/groups/new` | Create form |

BFF already proxies GET/POST `/api/groups`.

## Files to Modify / Create

**To Modify:**
- `apps/api/.../groups.service.ts`, repository, specs
- user-web groups client / i18n / home link
- mobile remote DS, routes, pages

**To Create:**
- user-web groups list + create pages/components + tests
- mobile groups list + create pages/controllers/bindings + tests

## Build Order

| Phase | Owner | Work |
|-------|-------|------|
| 1 | API | Idempotent create + tests |
| 2 | User web | List + create UI + tests |
| 3 | Mobile | List + create UI + tests |

## Unit test plan

| Surface | Scenario |
|---------|----------|
| API | Create new group returns owner |
| API | Idempotent same id returns existing |
| API | Empty name 422 |
| API | Id owned by other user 409 |
| User web | Create form submits stable id |
| Mobile | Create controller keeps uuid across retry |

## Verification checklist

- [x] OpenAPI matches create idempotency behavior
- [x] Soft deletes unchanged
- [x] No financial amounts in fixtures
- [x] Design fidelity: adapted from Groups New CTA + onboarding form (Figma MCP rate-limited after metadata) — pass (adapted)

## AI Resolutions

- No exact Create Group frame → adapt Groups `1:800` / mobile `1:167` New CTA + onboarding form.
- `409 GROUP_ID_CONFLICT` for foreign UUID collision.
- List UI shipped minimally here for AC “appears in group list”.
