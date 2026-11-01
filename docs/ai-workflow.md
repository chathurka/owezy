# Owezy AI Workflow Guide

Owezy uses a **spec-driven AI pipeline** with a single entry command: `/spec-build`. Human review is encouraged between stages but the command runs all three stages automatically, applying AI gap recommendations inline.

---

## The pipeline

```
GitHub issue      specs/features/         specs/architecture/       apps/           PR
  #<id> or   ──►  yyMMddHHmm_<slug>.md ──►  yyMMddHHmm_<slug>.md ──►  code  ──►  develop
  description     + gap scan / apply        specs/openapi/
                                            Design: resources/ (when mocks exist)

/spec-build <id|text>                                                     /create-pr
```

---

## `/spec-build <issue-id | description>`

This one command replaces the three separate commands from simpler pipelines (spec-expand, spec-architecture, spec-implement). It runs them end-to-end.

### Stages

**Stage 1 — Expand**
- Checks for a clean working tree; branches from `origin/develop`
- Takes a GitHub issue ID (`#42`) or plain-text description
- Writes `specs/features/yyMMddHHmm_<slug>.md`
- **Gap scan:** scans the spec for missing AC, roles, edge cases, or surface assignments
- AI recommendations are applied directly into the spec, logged in an "AI Resolutions" section

**Stage 2 — Architecture + OpenAPI**
- Converts the spec into `specs/architecture/<stem>.md` and `specs/openapi/<stem>.yaml`
- Reads `resources/web-user/` and `resources/mobile/` if UI surfaces are in scope
- **Gap scan:** validates OpenAPI against AC, checks for screen/route coverage
- AI recommendations applied; conflicts flagged in Open Questions

**Stage 3 — Implement**
- Implements the vertical slice: API → admin-web (if scoped) → user-web (if scoped) → mobile (if scoped)
- Writes unit tests immediately after each surface's code
- Updates `docs/kb-state.md` to `implemented`
- Prints summary of all files created/modified and all AI resolutions applied

### Human checkpoints

Although `/spec-build` runs automatically, you should review and optionally revise:
1. `specs/features/<stem>.md` — before or after stage 1
2. `specs/architecture/<stem>.md` — before or after stage 2
3. Implemented code — before running `/create-pr`

To stop after a stage, edit the spec or architecture doc and mark `Status: draft` (the next stage reads `Status: approved`). The AI will not advance past a `draft` status.

---

## `/create-pr`

Runs path-conditional tests for every touched surface, reviews changed lines against code-review guidelines, derives PR copy from the feature spec, and creates a PR targeting `develop`.

---

## Local start commands

### `/start-api`

Starts Postgres (if needed), runs migrations, then `pnpm dev:api`.

→ http://localhost:3000 · Swagger: http://localhost:3000/api/docs

### `/start-user-web`

Runs `pnpm dev:user`.

→ http://localhost:3002

---

## MVP delivery phases (from Owezy_MVP_Scope)

| Phase | Scope |
|-------|-------|
| 1. Foundation | Auth, roles, core data model, sync architecture skeleton |
| 2. Expense Engine | Groups, expenses, split methods, balances, debt simplification |
| 3. Settlement | Settlements, history, activity feed, notifications |
| 4. Offline & Cross-Platform | Sync engine, conflict handling, multi-device testing |
| 5. Budget & Localization | Budgets, basic analytics, multi-currency, initial languages |
