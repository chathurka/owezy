# Owezy Testing Guide

---

## Philosophy

- Tests are written immediately after the feature code they cover.
- The architecture doc's **Unit test plan** is the checklist: every planned scenario must have a corresponding test file before the slice is marked done.
- No financial data or user PII in test fixtures.

---

## API (NestJS / Jest)

- Co-located spec files: `src/<domain>/<name>.service.spec.ts`.
- Use `@nestjs/testing` `Test.createTestingModule`; mock repository dependencies with `jest.fn()`.
- Run: `pnpm test` in `apps/api/`.
- Coverage: `pnpm test:cov`.

---

## Admin web / User web (Jest + React Testing Library)

- Test files co-located with components: `<component>.test.tsx`.
- Run: `pnpm test` in `apps/admin-web/` or `apps/user-web/`.

---

## Mobile (Flutter test)

- Mirror tree: `test/features/<name>/{data,domain,presentation}/`.
- Run: `flutter test` in `apps/mobile/`.
- Controller tests: call `controller.onInit()` directly, then assert `.value` changes via `expect(controller.someField.value, ...)`.
- No bloc_test; no mocktail at scaffold time (add if needed).

---

## Financial data rules

- Never use real amounts, balances, or group names in test fixtures.
- Use placeholder values: `amount: 10.00`, `groupName: 'Test Group'`, `email: 'test@example.com'`.
