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
- **Design tokens.** Import from `packages/design-system/` — no raw hex, rem, or px values.
- **No financial data in logs or test fixtures.**
- **All API calls via OpenAPI contract.** Never invent an endpoint.

## Testing

- Jest + React Testing Library.
- Test files co-located: `<component>.test.tsx`.
- No financial data in test fixtures.
