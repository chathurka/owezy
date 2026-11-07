---
name: start-user-web
description: >-
  Starts the Owezy user-web Next.js app on port 3002 with an environment
  (dev | qa | prod). Use when the user runs /start-user-web or /start-user-web <env>.
allowed-tools: Shell(pnpm *)
---

# start-user-web

Start the user-facing web app for a given environment.

## Arguments

Optional env after the command. Default: `dev`.

| Invocation | Env | Script |
|------------|-----|--------|
| `/start-user-web` | `dev` | `pnpm dev:user` |
| `/start-user-web dev` | `dev` | `pnpm dev:user` |
| `/start-user-web qa` | `qa` | `pnpm dev:user:qa` |
| `/start-user-web prod` | `prod` | `pnpm dev:user:prod` |

Reject any other env value — only `dev`, `qa`, and `prod` are allowed (ADR-0003).

## Process

1. **Resolve env** from the user argument (default `dev`).

2. **Start the app** from the monorepo root:
   - `dev` → `pnpm dev:user`
   - `qa` → `pnpm dev:user:qa`
   - `prod` → `pnpm dev:user:prod`

   Each package script copies `apps/user-web/env/.env.<env>` to `.env.local` then runs Next on port 3002.

3. **Run in the background** (Next keeps the process alive). Tell the user which env is running.

→ http://localhost:3002
