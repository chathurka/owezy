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

1. **Spec before code.** `/spec-build` is the only pipeline entrypoint.
2. **OpenAPI is the contract.** `specs/openapi/` is the source of truth for all API shapes.
3. **Stack only.** No new frameworks without an ADR.
4. **Design system tokens only.** `packages/design-system/` for web; `lib/core/theme/` mirrors for Flutter.
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
| `/create-pr` | Runs tests, reviews code, raises PR to `develop` |
| `/start-api` | Starts Postgres + migrations + NestJS API |
| `/start-user-web` | Starts user-web on port 3002 |
