# Owezy — AI Agent Context

Read this before editing any code in the Owezy repository. See `docs/kb-state.md` for the current feature inventory.

## What this project is

Owezy is an offline-first shared expense and budgeting application. Four surfaces:

| Surface | Stack | Path |
|---------|-------|------|
| REST API | NestJS (TypeScript) | `apps/api/` |
| Admin web | Next.js App Router | `apps/admin-web/` |
| User web | Next.js App Router | `apps/user-web/` |
| Mobile | Flutter + GetX | `apps/mobile/` |

## Non-negotiable rules

1. **Spec before code.** `/spec-build` (one story) or `/spec-build-batch` (2+ issues, one branch + PR) are the pipeline entrypoints.
2. **OpenAPI is the contract.** `specs/openapi/` is the source of truth for all API shapes.
3. **Stack only.** No new frameworks without an ADR.
4. **Design system tokens only + design fidelity.** `packages/design-system/` for web; `lib/core/theme/` mirrors for Flutter. Before UI work: user-web/mobile → Figma ([Owezy Web](https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web), [Owezy Mobile](https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile)) via MCP; admin-web → `resources/owezy-admin-console/`. Match designs; never invent parallel chrome.
5. **No financial data in logs or test fixtures.** Balances, amounts, and user data must never appear in code comments, console output, or committed test files.
6. **Soft deletes everywhere.** All syncable entities use `deleted_at` tombstones (ADR-0002).
7. **Audit integrity.** Never silently edit financial history; corrections create auditable actions.
8. **Vertical slices.** One feature end-to-end before starting the next.

## Surface rules

- `docs/rules/api.md` — NestJS Clean Architecture
- `docs/rules/admin-web.md` — Next.js admin (App Router, cookie auth)
- `docs/rules/user-web.md` — Next.js user web
- `docs/rules/mobile.md` — Flutter Clean Architecture + GetX

## Pipeline commands

| Command | What it does |
|---------|-------------|
| `/spec-build <id\|text>` | Full pipeline: expand → architecture + OpenAPI → implement |
| `/spec-build-batch <id>…` | Same pipeline for 2+ issues on one branch; commit per story; then `/create-pr` |
| `/create-pr` | Runs tests, reviews code, raises PR to `develop` |
| `/start-api [dev\|qa\|prod]` | Starts Postgres + migrations + NestJS API (default `dev`) |
| `/start-user-web [dev\|qa\|prod]` | Starts user-web on port 3002 (default `dev`) |
| `/start-mobile [dev\|qa\|prod]` | Starts Flutter mobile with env flavor (default `dev`) |
