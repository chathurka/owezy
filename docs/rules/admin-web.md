# Owezy Admin Web Rules

Source of truth for AI-assisted edits in `apps/admin-web/`.

---

## Architecture

Feature-first Clean Architecture under Next.js App Router:

```text
apps/admin-web/
├── app/
│   ├── (auth)/          login page
│   ├── (dashboard)/     authenticated admin screens
│   │   └── <feature>/   route per feature
│   └── api/auth/        BFF auth route handlers
├── src/
│   ├── core/
│   │   ├── auth/        verifyJwt
│   │   ├── config/      env.ts
│   │   ├── api/         fetch-client, api-error
│   │   ├── http/        redirect helper
│   │   ├── i18n/        message catalogs + `t()` helper
│   │   └── theme/       globals.css
│   ├── features/
│   │   └── <name>/
│   │       ├── data/      API calls, data-fetching functions
│   │       ├── domain/    types and business logic
│   │       └── presentation/  Server/Client components
│   ├── shared/            cross-feature utilities
│   └── components/        reusable UI components
```

## Rules

- **Server Components by default.** Use `"use client"` only for interactive components.
- **Cookie auth.** Access token in `owezy_access_token` httpOnly cookie; middleware verifies `role === 'admin'`.
- **BFF auth routes.** `app/api/auth/logout` and `app/api/auth/refresh` proxy to the Nest API.
- **Design tokens.** Import from `packages/design-system/` — no raw hex, rem, or px values. Dark mode: set via `ThemeProvider` (`src/core/theme/theme-provider.tsx`); `data-theme` on `<html>` flips CSS vars automatically.
- **Shared component kit.** `src/components/index.ts` — `Button`, `TextField`, `Switch`, `Avatar`, `Badge`, `Alert`, `FilterChip`, `Card`, `Amount`. Never duplicate these locally in feature code.
- **Design fidelity (mandatory before writing any UI).** All admin screens live as flat HTML in `resources/owezy-admin-console/` (`<Screen>.html` light, `<Screen>Dark.html` dark). Design board: `https://claude.ai/artifact/UWFiQPZRxkAiV92wRnq2Gu`. Read the mock HTML before writing any UI; match layout and chrome exactly. No extraction step needed — files are already individual HTML.
- **No financial data in logs or test fixtures.**
- **All API calls via OpenAPI contract.** Never invent an endpoint.

## Localization (required)

- **All user-facing copy must come from i18n message catalogs.** No hardcoded UI strings in pages, components, toasts, or client-side validation messages.
- Catalogs live under `src/core/i18n/` (e.g. `messages/en.ts`, shared `t(key, params?)` helper). Default locale: `en`.
- Prefer stable message keys (`auth.login.title`) over free-form English as keys.
- Map API error `code` values to localized strings in the presentation layer — do not render upstream `error.message` directly.
- New features must add message keys in the same change as the UI that uses them.
- Do not introduce a new i18n library (e.g. `next-intl`) without an ADR in `docs/decisions/`.

## Testing

- Jest + React Testing Library.
- Test files co-located: `<component>.test.tsx`.
- No financial data in test fixtures.
