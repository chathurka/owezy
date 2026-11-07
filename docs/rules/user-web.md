# Owezy User Web Rules

Source of truth for AI-assisted edits in `apps/user-web/`.

---

## Architecture

Same pattern as admin-web, adapted for user role:

```text
apps/user-web/
├── app/
│   ├── (auth)/          login, register, forgot-password
│   ├── (app)/           authenticated user screens
│   │   └── <feature>/   route per feature
│   └── api/auth/        BFF auth route handlers
├── src/
│   ├── core/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── api/
│   │   ├── http/
│   │   ├── i18n/        message catalogs + `t()` helper
│   │   └── theme/
│   ├── features/
│   │   └── <name>/{data,domain,presentation}
│   └── shared/
```

## Rules

- Same architecture as admin-web.
- Middleware verifies `role === 'user'`; protected route group is `(app)`.
- Cookie names are `owezy_access_token` / `owezy_refresh_token`.
- Design tokens from `packages/design-system/` only. Dark mode: set via `ThemeProvider` (`src/core/theme/theme-provider.tsx`); `data-theme` on `<html>` flips CSS vars automatically.
- Shared UI kit: `src/shared/ui/index.ts` — `Button`, `TextField`, `Switch`, `Avatar`, `Badge`, `Alert`, `FilterChip`, `Card`, `Amount`. Never duplicate these locally in feature code.
- All API calls via OpenAPI contract.
- **No financial data in logs or test fixtures.**
- **Design fidelity (mandatory before writing any UI).** All screens live in `resources/owezy-web/pages/*.dc.html` (19 screens extracted from the board HTML) and `resources/owezy-web/screenshots/`. Auth screens: `pages/SignIn.dc.html`, `pages/SignUp.dc.html`. Board HTML: `resources/owezy-web/Owezy Web Dashboard.html` (design board: `https://claude.ai/artifact/Pm7DX6oPiEtdh68f1Ryz7s`). Read the mock HTML **and** related screenshot before writing UI. Match layout and chrome exactly; do not invent a parallel visual language. If a screen is missing from `pages/`, extract it using the snippet in `resources/owezy-web/README.md`.

## Localization (required)

- **All user-facing copy must come from i18n message catalogs.** No hardcoded UI strings in pages, components, toasts, or client-side validation messages.
- Catalogs live under `src/core/i18n/` (e.g. `messages/en.ts`, shared `t(key, params?)` helper). Default locale: `en`.
- Prefer stable message keys (`auth.register.title`) over free-form English as keys.
- Map API error `code` values to localized strings in the presentation layer — do not render upstream `error.message` directly.
- New features must add message keys in the same change as the UI that uses them.
- Do not introduce a new i18n library (e.g. `next-intl`) without an ADR in `docs/decisions/`.
