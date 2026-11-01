# Owezy

An offline-first shared expense and budgeting application — built spec-first, implemented surface by surface.

---

## Architecture

```
                     ┌───────────────────────┐
                     │    specs/openapi/      │
                     │   (API contract)       │
                     └──────────┬────────────┘
                                │ consumed by all surfaces
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
 ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
 │  apps/admin-web  │  │   apps/mobile    │  │  apps/user-web   │
 │  Next.js admin   │  │  Flutter + GetX  │  │  Next.js user    │
 └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
          │                     │                      │
          └─────────────────────┼──────────────────────┘
                                ▼
                     ┌──────────────────┐
                     │    apps/api      │
                     │  NestJS REST /v1 │
                     └──────────┬───────┘
                                ▼
                           PostgreSQL
```

### Surfaces

| Surface | Stack | Purpose |
|---------|-------|---------|
| `apps/api` | NestJS · TypeScript | Versioned REST API (`/v1`), JWT auth |
| `apps/admin-web` | Next.js App Router | Admin console — users, groups, disputes, subscriptions, audit |
| `apps/mobile` | Flutter · Clean Arch · GetX | Primary user experience for iOS/Android; offline-first |
| `apps/user-web` | Next.js App Router | Web user dashboard |

---

## AI workflow — one command

```
/spec-build <github-issue-id | plain-text description>
```

This single command runs the full pipeline:
1. Expands a feature spec, scans for gaps and applies AI recommendations
2. Writes the architecture + OpenAPI
3. Implements the vertical slice across all in-scope surfaces
4. Updates `docs/kb-state.md`

See `docs/ai-workflow.md` for the full guide and `AGENTS.md` for non-negotiable rules.

---

## Monorepo scripts

Run from the repo root (requires `pnpm`):

| Script | What it does |
|--------|-------------|
| `pnpm db:up` | Start PostgreSQL via Docker Compose |
| `pnpm db:down` | Stop PostgreSQL |
| `pnpm db:migrate` | Run TypeORM migrations |
| `pnpm dev:api` | Start the NestJS API (`APP_ENV=dev`) |
| `pnpm dev:admin` | Start the Next.js admin panel (port 3001) |
| `pnpm dev:user` | Start the Next.js user web (port 3002) |

---

## Getting started

1. Read `AGENTS.md` — non-negotiable rules for AI and human contributors
2. Read `docs/ai-workflow.md` — full pipeline guide
3. Check `docs/kb-state.md` — feature inventory and pipeline status
4. Run `/spec-build <description>` to start a feature
