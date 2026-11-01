---
name: spec-build
description: >-
  Full Owezy feature pipeline in one command: expand spec + gap scan/apply →
  architecture + OpenAPI + gap scan/apply → implement vertical slice + tests → update kb-state.
  Use when the user runs /spec-build <issue-id | description>.
allowed-tools: Read, Write, Glob, Shell(git *), Shell(gh *), Shell(date *), Shell(pnpm *), Shell(flutter *)
---

# spec-build

Run the full Owezy pipeline end-to-end for one feature: expand → architecture → implement. AI gap recommendations are applied automatically; all resolutions are logged in the spec and architecture docs.

## When to use

- User runs `/spec-build 42` (GitHub issue) or `/spec-build <description>` (plain text)
- Starting a new feature from scratch

## Invocation

```
/spec-build <github-issue-id | plain-text description>
```

---

## Stage 1 — Expand

### Step 1.1 — Dirty-tree check

```
git status --porcelain
```

If any uncommitted changes exist, **stop** and tell the user to commit or stash first.

### Step 1.2 — Parse input

**GitHub issue ID** (`42` or `#42`):
```
gh issue view <id> --json title,body,labels,number,url
```
Extract `feature_title`, `issue_body`, `issue_url`, `issue_id`.

**Plain-text description:**
Set `feature_title = argument`, `issue_id = null`. Ask any necessary clarifying questions (roles, surfaces, edge cases) in one go, then continue.

### Step 1.3 — Create branch

Derive `slug` from `feature_title` (lowercase, kebab-case, max 40 chars).

```
git fetch origin develop
git checkout --no-track -b feature/<slug> origin/develop
```

### Step 1.4 — Write feature spec

Generate timestamp:
```
date -u +"%y%m%d%H%M"
```

Write `specs/features/<yyMMddHHmm>_<slug>.md` using `specs/_templates/feature-spec.md`.

Fill every section from the issue body or plain-text input. Do not invent business rules — mark unknowns as open questions.

### Step 1.5 — Gap scan (Stage 1)

Scan the written spec for:
- Missing acceptance criteria (AC without testable conditions)
- Unspecified roles for any surface checked in scope
- Uncovered edge cases (empty state, concurrent edit, offline, auth failure)
- Missing surface assignments (feature obviously needs a surface not checked)

For each gap found:
1. Add a recommendation bullet under **AI Resolutions** in the spec
2. Apply a reasonable default resolution directly into the spec body
3. Do NOT stop — continue after all gaps are resolved

### Step 1.6 — Set status and update kb-state

Set `Status: approved` in the spec (the AI pipeline owns approval; human may revert to `draft` to pause).

Open `docs/kb-state.md` and add a row:

| Column | Value |
|--------|-------|
| Stem | `<yyMMddHHmm>_<slug>` |
| Name | Feature title (short) |
| Status | `spec-approved` |
| Spec | `specs/features/<stem>.md` |
| All others | `—` |

---

## Stage 2 — Architecture + OpenAPI

### Step 2.1 — Determine feature type and surfaces

Read the spec's **Surfaces in scope** section. Classify:
- `api-only` — API only
- `admin-only` — admin-web only
- `full-stack` — API + one or more of: admin, user web, mobile

### Step 2.2 — Read design resources (UI features only)

For any feature with admin-web or user-web in scope:
1. List `resources/web-user/`
2. Read `resources/web-user/README.md`
3. If screen mocks exist, read the relevant `*-standalone-src.html` and `owezy-web-app-design-system.md`
4. If no mocks exist, proceed with stub screens — record the gap in Open Questions

For any feature with mobile in scope:
1. List `resources/mobile/`
2. Read `resources/mobile/README.md`
3. If screen mocks exist, read them and the design-system doc
4. If no mocks exist, proceed with stub screens — record the gap in Open Questions

For `api-only` features, skip this step.

### Step 2.3 — Write architecture doc

Write `specs/architecture/<stem>.md` using `specs/_templates/architecture.md`.

Include:
- Header metadata (status, spec link, feature type, OpenAPI path, Design paths)
- Scope
- Architecture Overview
- Key Design Decisions
- NestJS module design (for api / full-stack)
- Data model (only if schema changes)
- Auth / authorization
- Flutter feature design (only if mobile in scope; GetX patterns — see `docs/rules/mobile.md`)
- Next.js admin / user-web screen inventory (only if web in scope)
- Files to Modify / Create
- Build Order table
- Unit test plan (one row per scenario per surface)
- Verification checklist
- Critical Files
- Open Questions

### Step 2.4 — Write OpenAPI stub

Write `specs/openapi/<stem>.yaml` using `specs/_templates/openapi.yaml`.

Requirements:
- OpenAPI 3.1; use `$ref` to `_components.yaml` for shared schemas, security, responses, parameters
- Precise types for all request/response fields
- No invented fields not in the spec
- All endpoints JWT-protected by default; use `security: []` for public routes

### Step 2.5 — Gap scan (Stage 2)

Scan for:
- OpenAPI fields not traceable to an AC in the spec
- Missing error responses (401, 403, 404, 422)
- Screen/route coverage gaps vs acceptance criteria
- Mobile routes not yet added to `AppPages` template section
- Missing unit test plan rows for any surface in scope

Apply recommendations and log in the architecture doc's **AI Resolutions** section. Do not stop.

### Step 2.6 — Set status and update kb-state

Set `Status: approved` in the architecture doc.

Update `docs/kb-state.md` row:
- Status → `arch-approved`
- Arch → `specs/architecture/<stem>.md`
- OpenAPI → `specs/openapi/<stem>.yaml`
- Design → resource file paths (or `n/a`)

---

## Stage 3 — Implement

Read the architecture doc's **Feature type**, **Build Order**, and **Surfaces in scope**.

Implement surfaces in Build Order sequence. For each surface, write code then tests before moving to the next surface.

### Surface: NestJS API

Follow `docs/rules/api.md`. For each module:

```text
src/modules/<domain>/
  presentation/
    <domain>.controller.ts    (thin HTTP handler, OpenAPI annotations)
    dto/
      create-<entity>.dto.ts
      update-<entity>.dto.ts
  application/
    <domain>.service.ts
    use-cases/                (optional, for complex flows)
  domain/
    <entity>.entity.ts        (pure TS, no ORM)
    <domain>.repository.ts    (abstract port)
  infrastructure/
    <entity>.orm-entity.ts    (TypeORM @Entity, soft-delete column)
    <domain>.repository.impl.ts
  <domain>.module.ts
```

Write unit tests immediately: `<name>.service.spec.ts`, `<name>.repository.spec.ts`.

### Surface: Next.js admin web

Follow `docs/rules/admin-web.md`. Server Components for data fetching; `"use client"` for interactivity. All tokens from `packages/design-system/`.

Write unit tests: `<component>.test.tsx` co-located.

### Surface: Next.js user web

Follow `docs/rules/user-web.md`. Same rules as admin-web. Route group `(app)`.

Write unit tests: `<component>.test.tsx` co-located.

### Surface: Flutter mobile (GetX)

Follow `docs/rules/mobile.md`. **GetX only — no BLoC, GetIt, go_router.**

Feature structure:
```text
lib/features/<feature_name>/
  data/
    datasources/<feature>_remote_data_source.dart   (Retrofit @RestApi)
    models/<entity>_model.dart                       (json_serializable)
    repositories/<feature>_repository_impl.dart
  domain/
    entities/<entity>.dart                           (pure Dart)
    repositories/<feature>_repository.dart           (abstract)
    usecases/<verb>_<object>_usecase.dart
  presentation/
    controllers/<feature>_controller.dart            (GetxController + .obs)
    pages/<feature>_page.dart                        (GetView<Controller>)
    widgets/
    bindings/<feature>_binding.dart                  (Bindings)
```

Register new `GetPage` in `lib/app/routes/app_pages.dart`.

Write controller tests: `test/features/<name>/presentation/<feature>_controller_test.dart`.

### After all surfaces

1. Confirm every unit test plan row has a corresponding test file.
2. Walk the Verification checklist from the architecture doc.
3. Update `docs/kb-state.md`: Status → `implemented`; mark each surface `done` or `n/a`.

---

## Final output

Print:
```
Branch:    feature/<slug>
Spec:      specs/features/<stem>.md
Arch:      specs/architecture/<stem>.md
OpenAPI:   specs/openapi/<stem>.yaml

Surfaces implemented:  API | Admin | User web | Mobile  (list actuals)
Files created:         <count>
Files modified:        <count>

AI Resolutions applied:
  Stage 1: <brief list>
  Stage 2: <brief list>

Next step: review code + run /create-pr
```

---

## Rules

- **Never advance past a `draft` status** — if the spec or architecture is `draft`, stop and tell the user.
- **Never invent endpoints** not in the OpenAPI spec.
- **Never invent UI** not in `resources/` or traceable to an AC.
- **Never hardcode design tokens** — always use DS imports.
- **No financial data in test fixtures** — use placeholder values.
- **Soft deletes** on all syncable entities — include `deleted_at` column in every new TypeORM entity.
- **Client UUIDs** — all syncable entity IDs are `uuid` type, set by the client.
- **GetX only** on mobile — no BLoC, GetIt, go_router.
- One vertical slice at a time. Do not start the next feature until this one is complete.
