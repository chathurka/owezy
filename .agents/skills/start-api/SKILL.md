---
name: start-api
description: >-
  Starts PostgreSQL (if not running), runs migrations, then starts the NestJS API
  with an environment (dev | qa | prod). Use when the user runs /start-api or
  /start-api <env>.
allowed-tools: Shell(docker *), Shell(pnpm *), Shell(git *)
---

# start-api

Start the Owezy API locally for a given environment.

## Arguments

Optional env after the command. Default: `dev`.

| Invocation | Env | Script |
|------------|-----|--------|
| `/start-api` | `dev` | `pnpm dev:api` |
| `/start-api dev` | `dev` | `pnpm dev:api` |
| `/start-api qa` | `qa` | `pnpm dev:api:qa` |
| `/start-api prod` | `prod` | `pnpm dev:api:prod` |

Reject any other env value — only `dev`, `qa`, and `prod` are allowed (ADR-0003).

## Process

1. **Resolve env** from the user argument (default `dev`).

2. **Start Postgres** (if not already running):
   ```
   docker compose up -d postgres
   ```

3. **Wait for Postgres health:**
   ```
   docker compose ps postgres
   ```
   Retry a few times if not healthy yet.

4. **Copy env file** for the resolved env:
   ```
   cd apps/api && cp env/.env.<env> .env
   ```
   Example for `qa`: `cp env/.env.qa .env`

5. **Run migrations:**
   ```
   pnpm db:migrate
   ```

6. **Start API** from the monorepo root:
   - `dev` → `pnpm dev:api`
   - `qa` → `pnpm dev:api:qa`
   - `prod` → `pnpm dev:api:prod`

   Run in the background (Nest `--watch` keeps the process alive). Tell the user which env is running.

→ API: http://localhost:3000  
→ Swagger: http://localhost:3000/api/docs
