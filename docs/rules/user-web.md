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
- **Design fidelity (mandatory before writing any UI).** Source of truth is Figma [Owezy Web](https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web) (`fileKey` `Y7uE63pfuGfkuOHxfeUf3J`). Load `/figma-design-to-code`, then use `get_screenshot` + `get_design_context` for the target `node-id` before writing UI. Match layout and chrome exactly; do not invent a parallel visual language. Do not use local `resources/owezy-web/` HTML/PNG for new UI. If a frame is missing, adapt the closest screen in the same Figma file and record the borrowed `node-id`.

## Localization (required)

- **All user-facing copy must come from i18n message catalogs.** No hardcoded UI strings in pages, components, toasts, or client-side validation messages.
- Catalogs live under `src/core/i18n/` (e.g. `messages/en.ts`, shared `t(key, params?)` helper). Default locale: `en`.
- Prefer stable message keys (`auth.register.title`) over free-form English as keys.
- Map API error `code` values to localized strings in the presentation layer — do not render upstream `error.message` directly.
- New features must add message keys in the same change as the UI that uses them.
- Do not introduce a new i18n library (e.g. `next-intl`) without an ADR in `docs/decisions/`.
