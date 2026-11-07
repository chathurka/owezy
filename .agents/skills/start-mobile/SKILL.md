---
name: start-mobile
description: >-
  Starts the Owezy Flutter mobile app with an environment flavor (dev | qa | prod).
  Use when the user runs /start-mobile or /start-mobile <env>.
allowed-tools: Shell(pnpm *), Shell(flutter *)
---

# start-mobile

Start the Flutter mobile app for a given environment.

## Arguments

Optional env after the command. Default: `dev`.

| Invocation | Env | Script |
|------------|-----|--------|
| `/start-mobile` | `dev` | `pnpm dev:mobile` |
| `/start-mobile dev` | `dev` | `pnpm dev:mobile` |
| `/start-mobile qa` | `qa` | `pnpm dev:mobile:qa` |
| `/start-mobile prod` | `prod` | `pnpm dev:mobile:prod` |

Reject any other env value — only `dev`, `qa`, and `prod` are allowed (ADR-0003).

## Process

1. **Resolve env** from the user argument (default `dev`).

2. **Start the app** from the monorepo root:
   - `dev` → `pnpm dev:mobile`
   - `qa` → `pnpm dev:mobile:qa`
   - `prod` → `pnpm dev:mobile:prod`

   Each script runs `flutter run --dart-define=APP_FLAVOR=<env>`, which loads `apps/mobile/env/.env.<env>`.

3. **Run in the background** (Flutter keeps the process alive). Tell the user which flavor is running and that device/emulator selection happens in the Flutter CLI if multiple devices are available.

## Notes

- Env config is selected via `APP_FLAVOR` (see `apps/mobile/lib/core/config/env_config.dart`). Do not pass `FLUTTER_APP_FLAVOR` — Flutter reserves that name for native `--flavor`.
- VS Code / Cursor launch configs `mobile:dev`, `mobile:qa`, `mobile:prod` are equivalent for IDE debugging.
