# Owezy — AI Agent Context

Read this before making any changes in the Owezy repository.
See `docs/kb-state.md` for the current feature inventory — which features exist, their pipeline status, and which surfaces are implemented.

## What this project is

Owezy is an offline-first shared expense and budgeting application for friends, roommates, couples, travelers, and small groups. It consists of four surfaces:

| Surface | Stack | Path |
|---------|-------|------|
| REST API | NestJS (Node) | `apps/api/` |
| Admin web | Next.js (App Router) | `apps/admin-web/` |
| User web | Next.js (App Router) | `apps/user-web/` |
| Mobile | Flutter (Clean Architecture + GetX) | `apps/mobile/` |

## Non-negotiable rules

1. **Spec before code.** No feature code without an approved spec in `specs/features/` and architecture in `specs/architecture/`. Use `/spec-build <id|description>` for one story, or `/spec-build-batch <id>…` for multiple issues on one branch + PR — both run expand → architecture → implement, auto-applying AI gap recommendations.
2. **OpenAPI is the contract.** All API shapes live in `specs/openapi/`. Clients never invent endpoints; the API never deviates from the contract without updating the spec first.
3. **Stack only.** NestJS for API, Next.js for web, Flutter + GetX for mobile. Do not introduce other frameworks without an ADR in `docs/decisions/`.
4. **Design system is provided.** Never design tokens or UI components from scratch. Consume from `packages/design-system/` (Flutter: `lib/core/theme/`). Design handoffs:
   - **user-web** → Figma [Owezy Web](https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web) (`fileKey` `Y7uE63pfuGfkuOHxfeUf3J`) — use Figma MCP (`/figma-design-to-code`, `get_screenshot`, `get_design_context`); record URLs with `node-id`
   - **admin-web** → `resources/owezy-admin-console/<Screen>.html` (flat, no extraction). Design board: `https://claude.ai/artifact/UWFiQPZRxkAiV92wRnq2Gu`
   - **mobile** → Figma [Owezy Mobile](https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile) (`fileKey` `aPUmKuvCpwnIAD5m53Rh7c`) — use Figma MCP the same way; record URLs with `node-id`

   Read Figma (user-web/mobile) or admin HTML mocks before UI work and match fidelity. Do not invent a visual language. Do not use local `resources/owezy-web/` or `resources/owezy-mobile/` for new UI. Never use stale paths `resources/web-user/` or `resources/mobile/`.
5. **No financial data in logs or test fixtures.** Balances, transaction amounts, bank details, and user financial data must never appear in console output, code comments, or committed test files.
6. **Vertical slices only.** Implement one feature end-to-end (OpenAPI → Nest → web/mobile) before starting the next.
7. **Audit integrity.** Expenses, splits, and settlements are the source of truth; balances are derived. Never silently edit financial history. Corrections must create auditable actions.
8. **Soft deletes everywhere.** All syncable entities (groups, expenses, settlements, splits) use soft deletes/tombstones so deletions can synchronize safely across devices.

## Repo structure

```
apps/
  api/          NestJS — REST API
  admin-web/    Next.js — admin console
  user-web/     Next.js — user-facing web
  mobile/       Flutter — primary user mobile app (GetX)
packages/
  design-system/  shared DS tokens and components
  shared-types/   optional shared TypeScript types from OpenAPI
specs/
  _templates/   blank templates for feature specs, architecture, OpenAPI
  features/     expanded feature specs
  architecture/ architecture docs + unit test plans
  openapi/      OpenAPI YAML files — source of truth for API contract
docs/
  ai-context.md    surface-level AI guidance
  ai-workflow.md   how to drive the AI pipeline
  kb-state.md      feature knowledge-base state
  rules/           canonical coding rules per surface
    api.md
    admin-web.md
    user-web.md
    mobile.md
  decisions/       ADRs
resources/
  owezy-admin-console/  admin-web design handoff (HTML mocks)
  owezy-web/            legacy user-web HTML export (do not use for new UI — Figma is source of truth)
  owezy-mobile/         legacy mobile HTML export (do not use for new UI — Figma is source of truth)
.agents/skills/    portable AI skills (spec-build, spec-build-batch, create-pr, start-api, start-user-web, start-mobile)
.agents/guidelines/ code-review rules consumed by /create-pr
```

## Environments

Three environments: `dev` | `qa` | `prod`. See ADR-0003 for env names, API base URLs, and mobile flavors (`--flavor dev|qa|prod`). Never add a fourth environment without a new ADR.

## Auth

NestJS-issued JWT (access token + refresh token). Flutter holds tokens in `flutter_secure_storage` and injects via Dio Bearer interceptor. Admin/user web holds tokens in httpOnly cookies. No Amplify/Cognito unless an ADR approves it.

## Surface architecture rules

Each surface has a canonical rules file in `docs/rules/`. Read the relevant file before editing any code in that surface.

### API (`apps/api/`)

Full rules in `docs/rules/api.md`. Summary:
- Clean Architecture per module: `presentation/` → `application/` → `domain/` ← `infrastructure/`
- All modules under `src/modules/<domain>/`
- TypeORM + PostgreSQL; `synchronize: false`; migrations via CLI in `src/migrations/`
- Thin controllers; DTOs with `class-validator`; services call domain repository ports
- Nest JWT guards; `@Public()` for public routes; `@Roles()` for role enforcement
- OpenAPI annotations mandatory on every controller method
- Stable `error.code` for client localization; `message` is English fallback only

### Admin web (`apps/admin-web/`)

Full rules in `docs/rules/admin-web.md`. Summary:
- Feature-first Clean Architecture under App Router: `features/<name>/{data,domain,presentation}`
- Server Components by default; `"use client"` only for interactivity
- Auth: httpOnly JWT cookies; middleware verifies `role === 'admin'`
- BFF route handlers at `app/api/auth/{refresh,logout}` proxy to Nest API
- Localization: UI copy from `src/core/i18n/` via `t()`; no hardcoded strings

### User web (`apps/user-web/`)

Full rules in `docs/rules/user-web.md`. Summary:
- Same architecture as admin-web; middleware verifies `role === 'user'`; route group `(app)` for authenticated screens
- Same httpOnly cookie auth, design-system, and data-fetching rules
- Localization: UI copy from `src/core/i18n/` via `t()`; no hardcoded strings

### Mobile (`apps/mobile/`)

Full rules in `docs/rules/mobile.md`. Summary:
- `lib/core/` — config, networking (Dio/Retrofit), storage, session, routing (GetX), theme, widgets
- `lib/features/<name>/` — Clean Architecture: `data/` → `domain/` → `presentation/`
- `lib/app/` — GetMaterialApp, GetPage routes, InitialBinding
- State: GetX (`GetxController` + `.obs` observables, `Obx` for reactive UI)
- DI: GetX bindings (`Get.lazyPut`, `Get.find`) — no GetIt
- Routing: GetX (`GetPage`, `Get.toNamed`, `Get.offAllNamed`) — no go_router
- Auth: Nest-issued JWT in `flutter_secure_storage`; `RequestInterceptor` injects Bearer; `SessionService` (GetxController) drives navigation
- Localization: Flutter gen-l10n (`lib/l10n/*.arb` + `AppLocalizations`); no hardcoded UI copy; no GetX `.tr`

## AI workflow command

| Command | What it does |
|---------|-------------|
| `/spec-build <id \| description>` | Full pipeline: expand spec + gap scan → architecture + OpenAPI → implement vertical slice + tests |
| `/spec-build-batch <id>…` | Full pipeline for 2+ GitHub issues on one branch; commit per story; then `/create-pr` |
| `/create-pr` | Runs tests, reviews changed lines, raises PR to `develop` |
| `/start-api [dev\|qa\|prod]` | Starts NestJS API locally (Postgres + migrate; default `dev`) |
| `/start-user-web [dev\|qa\|prod]` | Starts user-web on port 3002 (default `dev`) |
| `/start-mobile [dev\|qa\|prod]` | Starts Flutter mobile with env flavor (default `dev`) |

Full instructions in `docs/ai-workflow.md`.
