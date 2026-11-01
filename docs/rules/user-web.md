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
│   │   └── theme/
│   ├── features/
│   │   └── <name>/{data,domain,presentation}
│   └── shared/
```

## Rules

- Same architecture as admin-web.
- Middleware verifies `role === 'user'`; protected route group is `(app)`.
- Cookie names are `owezy_access_token` / `owezy_refresh_token`.
- Design tokens from `packages/design-system/` only.
- All API calls via OpenAPI contract.
- **No financial data in logs or test fixtures.**
- When design mocks exist in `resources/web-user/`, always read them before writing UI code.
