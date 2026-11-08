# Owezy Code Review Guidelines

Used by `/create-pr` to review changed lines before raising a PR.

---

## Blockers (must fix before PR)

1. **Financial data in logs or test fixtures** — Balances, amounts, group names with real-looking values, or user identifiers must never appear in `console.log`, `this.logger`, code comments, or committed test files.
2. **Hardcoded design tokens** — No raw hex (`#1a6ef0`), rem, or px values in component code. Must use CSS variables or DS token imports.
3. **Missing soft-delete column** — Any new TypeORM entity that models a syncable domain object (groups, expenses, splits, settlements, budgets) must include a `deleted_at: Date | null` column.
4. **BLoC / GetIt / go_router in mobile** — No imports of `flutter_bloc`, `get_it`, or `go_router` in `apps/mobile/`.
5. **Endpoint not in OpenAPI** — Any API endpoint called from a client must be in `specs/openapi/<stem>.yaml`. Any new Nest endpoint must also appear there.
6. **Hardcoded client UUIDs** — Syncable entities must use `uuid` type with client-generated IDs, not server auto-increments.
7. **UI diverges from design handoff** — For UI changes under `apps/user-web/`, `apps/admin-web/`, or `apps/mobile/`, compare against the architecture **Design:** refs: user-web/mobile Figma URLs with `node-id` (Owezy Web `Y7uE63pfuGfkuOHxfeUf3J`, Owezy Mobile `aPUmKuvCpwnIAD5m53Rh7c`); admin-web `resources/owezy-admin-console/` HTML. Block if the shipped UI clearly invents a different layout/chrome while a design (or documented adaptation) exists. Stale paths `resources/web-user/` / `resources/mobile/` in docs are also a blocker to fix.

## Warnings (flag but don't block)

- Controller doing DB work directly (should go through service/repository)
- Large controller methods (> 30 lines) — suggest extracting a use case
- Missing `@ApiOperation` or `@ApiResponse` on a Nest controller method
- Mobile `GetxController` exceeds ~150 lines — suggest splitting
- `Obx` wrapping code that doesn't use any `.obs` value
- Missing `fenix: true` on `Get.lazyPut` for core services
