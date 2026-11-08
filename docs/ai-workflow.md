# Owezy AI Workflow Guide

Owezy uses a **spec-driven AI pipeline**. Primary entry command: `/spec-build` (one story). For several GitHub issues on one branch + PR, use `/spec-build-batch`. Human review is encouraged between stages but each command runs the pipeline automatically, applying AI gap recommendations inline.

---

## The pipeline

```
GitHub issue      specs/features/         specs/architecture/       apps/           PR
  #<id> or   ──►  yyMMddHHmm_<slug>.md ──►  yyMMddHHmm_<slug>.md ──►  code  ──►  develop
  description     + gap scan / apply        specs/openapi/
                                            Design: resources/ (when mocks exist)

/spec-build <id|text>                                                     /create-pr
/spec-build-batch <id> <id> …   (shared branch; one commit per story; then /create-pr)
```

---

## `/spec-build <issue-id | description>`

This one command replaces the three separate commands from simpler pipelines (spec-expand, spec-architecture, spec-implement). It runs them end-to-end for **one** feature.

### Stages

**Stage 1 — Expand**
- Checks for a clean working tree; branches from `origin/develop`
- Takes a GitHub issue ID (`#42`) or plain-text description
- Writes `specs/features/yyMMddHHmm_<slug>.md`
- **Gap scan:** scans the spec for missing AC, roles, edge cases, or surface assignments
- AI recommendations are applied directly into the spec, logged in an "AI Resolutions" section

**Stage 2 — Architecture + OpenAPI**
- Converts the spec into `specs/architecture/<stem>.md` and `specs/openapi/<stem>.yaml`
- **Design discovery (mandatory for UI):** reads the real handoff roots — `resources/owezy-web/`, `resources/owezy-admin-console/`, `resources/owezy-mobile/` (screenshots + `*.dc.html` + tokens / `DESIGN_SPEC.md`). Never use the stale paths `resources/web-user/` or `resources/mobile/`. Board HTML files contain every screen as compressed blobs: `resources/owezy-web/Owezy Web Dashboard.html` (user-web, 19 pages), `resources/owezy-mobile/Owezy Mobile App.html` (mobile). Admin-web screens are flat HTML files — no extraction needed. See each README for the extraction snippet and page UUID map.
- Records exact Design paths in the architecture header; if no exact mock exists, documents an adaptation from the closest screen (not a generic Material stub).
- **Gap scan:** validates OpenAPI against AC, screen/route coverage, and design path validity
- AI recommendations applied; conflicts flagged in Open Questions

**Stage 3 — Implement**
- Implements the vertical slice: API → admin-web (if scoped) → user-web (if scoped) → mobile (if scoped)
- Ports UI from the Design paths — match layout, chrome, and states from mocks; tokens only via DS / `lib/core/theme/`
- Writes unit tests immediately after each surface's code
- **Design fidelity gate:** re-opens mocks/screenshots and fixes mismatches before marking surfaces `done`
- Updates `docs/kb-state.md` to `implemented`
- Prints summary of files, AI resolutions, and design fidelity result

### Human checkpoints

Although `/spec-build` runs automatically, you should review and optionally revise:
1. `specs/features/<stem>.md` — before or after stage 1
2. `specs/architecture/<stem>.md` — before or after stage 2
3. Implemented code — before running `/create-pr`

To stop after a stage, edit the spec or architecture doc and mark `Status: draft` (the next stage reads `Status: approved`). The AI will not advance past a `draft` status.

---

## `/spec-build-batch <id> <id> …`

Runs the full `/spec-build` pipeline for **multiple GitHub issues on one shared `feature/<slug>` branch**, commits after each story, then runs `/create-pr` (unless `--no-pr`).

```
/spec-build-batch 123 124 125 126 127
```

IDs may also be newline-separated under the command. Requires **2+** numeric issue IDs (plain-text descriptions are not supported — use `/spec-build` for those). Recommended max: 8 issues per batch.

Details: `.cursor/skills/spec-build-batch/SKILL.md` (mirrors `.agents/skills/spec-build-batch/`).

---

## `/create-pr`

Runs path-conditional tests for every touched surface, reviews changed lines against code-review guidelines, derives PR copy from the feature spec, and creates a PR targeting `develop`.

---

## Local start commands

### `/start-api [dev|qa|prod]`

Starts Postgres (if needed), copies `apps/api/env/.env.<env>`, runs migrations, then starts the API (default `dev`).

| Command | Script |
|---------|--------|
| `/start-api` or `/start-api dev` | `pnpm dev:api` |
| `/start-api qa` | `pnpm dev:api:qa` |
| `/start-api prod` | `pnpm dev:api:prod` |

→ http://localhost:3000 · Swagger: http://localhost:3000/api/docs

### `/start-user-web [dev|qa|prod]`

Starts user-web on port 3002 with the matching env file (default `dev`).

| Command | Script |
|---------|--------|
| `/start-user-web` or `/start-user-web dev` | `pnpm dev:user` |
| `/start-user-web qa` | `pnpm dev:user:qa` |
| `/start-user-web prod` | `pnpm dev:user:prod` |

→ http://localhost:3002

### `/start-mobile [dev|qa|prod]`

Starts the Flutter mobile app with `APP_FLAVOR` (default `dev`).

| Command | Script |
|---------|--------|
| `/start-mobile` or `/start-mobile dev` | `pnpm dev:mobile` |
| `/start-mobile qa` | `pnpm dev:mobile:qa` |
| `/start-mobile prod` | `pnpm dev:mobile:prod` |

Loads `apps/mobile/env/.env.<flavor>`.

---

## MVP delivery phases (from Owezy_MVP_Scope)

| Phase | Scope |
|-------|-------|
| 1. Foundation | Auth, roles, core data model, sync architecture skeleton |
| 2. Expense Engine | Groups, expenses, split methods, balances, debt simplification |
| 3. Settlement | Settlements, history, activity feed, notifications |
| 4. Offline & Cross-Platform | Sync engine, conflict handling, multi-device testing |
| 5. Budget & Localization | Budgets, basic analytics, multi-currency, initial languages |
