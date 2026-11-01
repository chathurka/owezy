---
name: start-api
description: >-
  Starts PostgreSQL (if not running), runs migrations, then starts the NestJS API in dev mode.
  Use when the user runs /start-api.
allowed-tools: Shell(docker *), Shell(pnpm *), Shell(git *)
---

# start-api

Start the Owezy API locally.

## Process

1. **Start Postgres** (if not already running):
   ```
   docker compose up -d postgres
   ```

2. **Wait for Postgres health:**
   ```
   docker compose ps postgres
   ```
   Retry a few times if not healthy yet.

3. **Copy env file:**
   ```
   cd apps/api && cp env/.env.dev .env
   ```

4. **Run migrations:**
   ```
   pnpm db:migrate
   ```

5. **Start API:**
   ```
   pnpm dev:api
   ```

→ API: http://localhost:3000  
→ Swagger: http://localhost:3000/api/docs
