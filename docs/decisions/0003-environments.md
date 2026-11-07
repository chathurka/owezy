# ADR-0003: Environments

**Status:** accepted  
**Date:** 2026-11-01

## Decision

Three environments: `dev` | `qa` | `prod`.

| Environment | Purpose | API base URL | Mobile flavor |
|-------------|---------|--------------|---------------|
| dev | Local development | http://localhost:3000 | `--flavor dev` |
| qa | Pre-production testing | https://api.qa.owezy.app | `--flavor qa` |
| prod | Production | https://api.owezy.app | `--flavor prod` |

### Selection

- **API:** `APP_ENV` env var (`dev` default). Env file loaded from `apps/api/env/.env.<APP_ENV>`.
- **Web:** `NEXT_PUBLIC_APP_ENV` env var. Env file selected by `pnpm use:<env>` script.
- **Mobile:** `APP_FLAVOR` dart-define (`--dart-define=APP_FLAVOR=<env>`). Env file loaded from `env/.env.<flavor>`. (`FLUTTER_APP_FLAVOR` is reserved by Flutter for native `--flavor` and must not be set manually.)

### Secret management

- Committed placeholder files at `apps/*/env/.env.{dev,qa,prod}` — no real secrets.
- Local overrides in `apps/api/.env` (gitignored).
- CI/CD injects real secrets via environment variables.

## Consequences

- Never add a fourth environment without a new ADR.
- Never commit real API keys, JWT secrets, or database passwords.
