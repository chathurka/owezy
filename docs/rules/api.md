# Owezy API Rules

Source of truth for AI-assisted edits in `apps/api/`.

---

## Project shape

Clean Architecture layered inside NestJS modules:

```
presentation  →  application  →  domain  ←  infrastructure
(controller)     (service)        (port)       (TypeORM repo)
```

```text
apps/api/src/
├── main.ts
├── app.module.ts
├── data-source.ts
├── core/
│   ├── config/     ConfigModule + env validation (Joi)
│   ├── auth/       JwtStrategy, JwtAuthGuard, @Public(), RolesGuard, Role enum
│   ├── filters/    GlobalExceptionFilter
│   ├── interceptors/ ResponseInterceptor (wraps in {data: T})
│   └── database/   TypeORM forRootAsync factory
├── migrations/     TypeORM CLI migrations (src root)
└── modules/
    └── <domain>/
        ├── presentation/
        │   ├── <domain>.controller.ts
        │   ├── dto/
        │   └── responses/
        ├── application/
        │   ├── <domain>.service.ts
        │   └── use-cases/
        ├── domain/
        │   ├── <entity>.entity.ts       (pure TS — no ORM decorators)
        │   └── <domain>.repository.ts   (abstract port)
        └── infrastructure/
            ├── <entity>.orm-entity.ts   (TypeORM @Entity)
            └── <domain>.repository.impl.ts
```

## Dependency direction

```
presentation → application → domain ← infrastructure
```

- Controllers call service methods only.
- Services call domain repository ports (the abstract interface).
- Infrastructure implements the port and may import TypeORM entities.
- Domain must not import NestJS, TypeORM, or DTO classes.
- DTOs live in `presentation/dto/` — they are transport objects, not domain entities.

## File naming

`snake-case` for all TS files and folders.

## Database

- TypeORM + PostgreSQL; `synchronize: false`; migrations via CLI.
- `src/migrations/` at the `src/` root.
- Soft deletes via `deleted_at` column on all syncable entities (ADR-0002).
- Client-generated UUIDs for syncable entities (groups, expenses, settlements, splits).

## API shapes

- Response always `{ data: T }` via `ResponseInterceptor`.
- Error always `{ error: { code, message, details? }, path, timestamp }` via `GlobalExceptionFilter`.
- OpenAPI annotations mandatory on every controller method.
- JWT-protected by default; use `@Public()` to opt out.
- Use `@Roles(Role.Admin)` for admin-only endpoints.

## Localization

- Clients own UI localization. The API does **not** return translated copy for screens.
- Every error must include a stable machine-readable `error.code` (e.g. `EMAIL_ALREADY_REGISTERED`, `VALIDATION_FAILED`). Clients map codes → localized strings.
- `error.message` is an English developer/fallback string for logs and OpenAPI docs — never assume clients display it.
- Do not add Accept-Language–driven response translation without an ADR.

## Financial integrity rules

- Balances are **derived** — never stored as source of truth.
- Expenses and settlements must never be silently mutated. Corrections create new adjustment records.
- No financial amounts or user identifiers in log messages.

## Testing

- Co-located spec files: `<name>.service.spec.ts`, `<name>.repository.spec.ts`.
- Jest + `@nestjs/testing`; mock repository deps with `jest.fn()`.
- No financial data in test fixtures; use placeholder values.
