---
name: create-pr
description: >-
  Runs path-conditional tests, reviews changed lines against Owezy code-review guidelines,
  and creates a PR targeting develop. Use when the user runs /create-pr.
allowed-tools: Read, Glob, Shell(git *), Shell(gh *), Shell(pnpm *), Shell(flutter *)
---

# create-pr

Run tests for every touched surface, review the diff, and raise a PR to `develop`.

## When to use

- User runs `/create-pr` after implementing a feature

## Process

### Step 1 — Verify branch

```
git status
git branch --show-current
```

Branch must follow `feature/<slug>` or `bug/<slug>`. If on `main`/`master`/`develop`, stop.

### Step 2 — Run tests

Detect touched apps from `git diff develop...HEAD --name-only`:

- `apps/api/**` → `pnpm test` in `apps/api/`
- `apps/admin-web/**` → `pnpm test` in `apps/admin-web/`
- `apps/user-web/**` → `pnpm test` in `apps/user-web/`
- `apps/mobile/**` → `flutter test` in `apps/mobile/`

If any test fails, **stop** and report the failure. Do not raise a PR until tests pass.

### Step 3 — Code review

Read `.agents/guidelines/code-review-guidelines.md`.

Review changed lines for:
- Financial data in logs or test fixtures (blocker)
- Hardcoded design tokens (blocker)
- Missing `deleted_at` on new syncable TypeORM entities (blocker)
- BLoC / GetIt / go_router imports in `apps/mobile/` (blocker)
- Endpoints not in `specs/openapi/<stem>.yaml` (blocker)
- **UI not matching Design paths** in the architecture doc — when `apps/user-web/`, `apps/admin-web/`, or `apps/mobile/` UI changed, re-open Design refs (user-web/mobile: Figma URLs with `node-id` via MCP screenshot/context; admin: `resources/owezy-admin-console/` HTML) and block if layout/chrome clearly diverges without a documented adaptation (blocker)
- GetX patterns violated (warn)

Report all blockers to the user before proceeding.

### Step 4 — Push and create PR

```
git push -u origin HEAD

gh pr create \
  --title "<feature title from spec>" \
  --base develop \
  --body "$(cat <<'EOF'
## Summary
- <bullet 1 from spec summary>
- <bullet 2>

## Surfaces implemented
- API: done/n/a
- Admin web: done/n/a
- User web: done/n/a
- Mobile: done/n/a

## Test plan
- [ ] All unit tests pass locally
- [ ] Verification checklist from architecture doc reviewed
- [ ] Design fidelity checked against resources/owezy-* mocks (or documented adaptation)
- [ ] No financial data in test fixtures
- [ ] OpenAPI contract unchanged or updated first

## References
- Spec: specs/features/<stem>.md
- Architecture: specs/architecture/<stem>.md
- Design: <paths from architecture Design header>
EOF
)"
```

Return the PR URL.
