# Owezy — Feature Knowledge-Base State

**Last updated:** 2026-11-07

---

## Active features

| Stem | Name | Status | Spec | Arch | OpenAPI | Design | API | Admin | User web | Mobile | Notes |
|------|------|--------|------|------|---------|--------|-----|-------|----------|--------|-------|
| 2611071428_register-email-password | Register email/password | implemented | specs/features/2611071428_register-email-password.md | specs/architecture/2611071428_register-email-password.md | specs/openapi/2611071428_register-email-password.yaml | resources/owezy-web/00 · Sign up-html/SignUp.dc.html; resources/owezy-mobile/prototype/screens/CreateAccount.dc.html | done | n/a | done* | done | E01-S01 #120; mobile register UI matched Sign up mock (adapted); *user-web pixel pass vs SignUp.dc.html still open |

---

## Status values

| Value | Meaning |
|-------|---------|
| `spec-draft` | Spec created, not yet approved |
| `spec-approved` | Spec approved, ready for architecture |
| `arch-draft` | Architecture created, not yet approved |
| `arch-approved` | Architecture approved, ready for implementation |
| `implemented` | All in-scope surfaces implemented and reviewed |
| `pr-open` | PR raised; awaiting review |
| `merged` | Merged to develop |

---

## Design system widget layer

**Status:** Implemented (2026-11-07) — ADR-0006

| Surface | Light/Dark wiring | Shared primitive kit | Full DESIGN_SPEC §2 |
|---------|-------------------|---------------------|---------------------|
| Mobile | ✓ `ThemeController` + `darkTheme` on `GetMaterialApp` | ✓ `lib/core/widgets/` (10 primitives) | ✓ hero, group card, list row, segmented, tabs, progress, amount input, bottom tab bar |
| User-web | ✓ `ThemeProvider` + inline script (no FOUC) | ✓ `src/shared/ui/` (10 primitives) | n/a |
| Admin-web | ✓ `ThemeProvider` + inline script (no FOUC) | ✓ `src/components/` (10 primitives + danger/info variants) | n/a |

Theme-aware colour API: mobile uses `context.app*` extension (`app_colors_ext.dart`); web surfaces use CSS variables which flip automatically via `[data-theme]`.

---

## MVP phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1. Foundation | in progress | Auth, roles, core data model, sync architecture |
| 2. Expense Engine | not started | Groups, expenses, splits, balances |
| 3. Settlement | not started | Settlements, history, activity feed |
| 4. Offline & Cross-Platform | not started | Sync engine, conflict handling |
| 5. Budget & Localization | not started | Budgets, analytics, multi-currency, i18n |
