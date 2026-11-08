# Owezy — Feature Knowledge-Base State

**Last updated:** 2026-11-08 (E03-S05 manage members)

---

## Active features

| Stem | Name | Status | Spec | Arch | OpenAPI | Design | API | Admin | User web | Mobile | Notes |
|------|------|--------|------|------|---------|--------|-----|-------|----------|--------|-------|
| 2611081613_view-and-manage-members | View and manage members | implemented | specs/features/2611081613_view-and-manage-members.md | specs/architecture/2611081613_view-and-manage-members.md | specs/openapi/2611081613_view-and-manage-members.yaml | Figma Web 1-1257; Mobile 1-380 (adapted) | done | n/a | done | done | E03-S05 #137; list/remove members soft-delete |
| 2611081612_accept-invitation-and-join-group | Accept invitation and join group | implemented | specs/features/2611081612_accept-invitation-and-join-group.md | specs/architecture/2611081612_accept-invitation-and-join-group.md | specs/openapi/2611081612_accept-invitation-and-join-group.yaml | adapted join/accept chrome | done | n/a | done | done | E03-S04 #136; POST /v1/invitations/accept |
| 2611081609_invite-members | Invite members | implemented | specs/features/2611081609_invite-members.md | specs/architecture/2611081609_invite-members.md | specs/openapi/2611081609_invite-members.yaml | Figma Web 1-1257; Mobile 1-380 (adapted) | done | n/a | done | done | E03-S03 #135; group_invitations; create/list/revoke |
| 2611081606_view-groups-and-group-overview | View groups and group overview | implemented | specs/features/2611081606_view-groups-and-group-overview.md | specs/architecture/2611081606_view-groups-and-group-overview.md | specs/openapi/2611081606_view-groups-and-group-overview.yaml | Figma Web 1-800,1-1257; Mobile 1-167,1-380 (adapted — empty activity) | done | n/a | done | done | E03-S02 #134; GET /v1/groups/:id; memberCount |
| 2611081557_create-a-group | Create a group | implemented | specs/features/2611081557_create-a-group.md | specs/architecture/2611081557_create-a-group.md | specs/openapi/2611081557_create-a-group.yaml | https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web?node-id=1-800; https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-167 (adapted) | done | n/a | done | done | E03-S01 #133; idempotent POST /v1/groups |
| 2611080838_manage-profile-and-preferences | Manage profile and preferences | implemented | specs/features/2611080838_manage-profile-and-preferences.md | specs/architecture/2611080838_manage-profile-and-preferences.md | specs/openapi/2611080838_manage-profile-and-preferences.yaml | Settings.dc.html; Profile.dc.html + screenshots | done | n/a | done | done | E02-S05 #132; Settings/Profile edit via GET/PATCH me |
| 2611080833_create-or-join-first-group-onboarding | Create or join first group onboarding | implemented | specs/features/2611080833_create-or-join-first-group-onboarding.md | specs/architecture/2611080833_create-or-join-first-group-onboarding.md | specs/openapi/2611080833_create-or-join-first-group-onboarding.yaml | Groups.dc.html; SignUp first-group step (adapted) | done | n/a | done | done | E02-S04 #131; POST/GET groups; join code; skip flag |
| 2611080831_choose-preferred-language | Choose preferred language | implemented | specs/features/2611080831_choose-preferred-language.md | specs/architecture/2611080831_choose-preferred-language.md | specs/openapi/2611080831_choose-preferred-language.yaml | adapted currency-select chrome (no language mock) | done | n/a | done | done | E02-S03 #130; preferredLocale en\|si; en fallback |
| 2611080829_choose-default-currency | Choose default currency | implemented | specs/features/2611080829_choose-default-currency.md | specs/architecture/2611080829_choose-default-currency.md | specs/openapi/2611080829_choose-default-currency.yaml | Settings Preferences currency; mobile Profile Default currency row (adapted into setup) | done | n/a | done | done | E02-S02 #129; PATCH defaultCurrency; no historical rewrite |
| 2611080820_complete-initial-profile-setup | Complete initial profile setup | implemented | specs/features/2611080820_complete-initial-profile-setup.md | specs/architecture/2611080820_complete-initial-profile-setup.md | specs/openapi/2611080820_complete-initial-profile-setup.yaml | resources/owezy-web/pages/Settings.dc.html; screenshots/12-Settings.png; resources/owezy-mobile/prototype/screens/Profile.dc.html; screenshots/light/Profile.png (adapted — no exact first-run mock) | done | n/a | done | done | E02-S01 #128; GET/PATCH /v1/users/me; profileSetupCompletedAt gate |
| 2611080528_sign-in-with-google | Sign in with Google | implemented | specs/features/2611080528_sign-in-with-google.md | specs/architecture/2611080528_sign-in-with-google.md | specs/openapi/2611080528_sign-in-with-google.yaml | resources/owezy-web/pages/SignIn.dc.html; SignUp.dc.html; resources/owezy-mobile/prototype/screens/SignIn.dc.html; CreateAccount.dc.html (adapted — no exact Google-only mock) | done | n/a | done | done | E01-S03 #122; ADR-0008; POST /v1/auth/google; GIS + google_sign_in |
| 2611080457_provision-secure-admin-accounts | Provision secure admin accounts | implemented | specs/features/2611080457_provision-secure-admin-accounts.md | specs/architecture/2611080457_provision-secure-admin-accounts.md | specs/openapi/2611080457_provision-secure-admin-accounts.yaml | Sign in — Light-html/Login.dc.html; Two-step verification — Light-html; access-denied adapted | done | done | n/a | n/a | E01-S08 #127; bootstrap env; TOTP MFA; provision API |
| 2611080449_sign-out-expired-sessions | Sign out / expired sessions | implemented | specs/features/2611080449_sign-out-expired-sessions.md | specs/architecture/2611080449_sign-out-expired-sessions.md | specs/openapi/2611080449_sign-out-expired-sessions.yaml | adapted SignIn session-expired banner (no exact mock) | done | done | done | done | E01-S07 #126; refresh_tokens + rotate; SESSION_EXPIRED; BFF logout sends refresh |
| 2611080436_recover-reset-password | Recover / reset password | implemented | specs/features/2611080436_recover-reset-password.md | specs/architecture/2611080436_recover-reset-password.md | specs/openapi/2611080436_recover-reset-password.yaml | adapted from SignIn chrome (no dedicated mock) | done | n/a | done | done | E01-S06 #125; non-enumerating forgot; 32-byte hex token; SHA-256 hash; 1800s TTL; 60s cooldown; password_changed_at bump |
| 2611080425_verify-email-address | Verify email address | implemented | specs/features/2611080425_verify-email-address.md | specs/architecture/2611080425_verify-email-address.md | specs/openapi/2611080425_verify-email-address.yaml | resources/owezy-mobile/prototype/screens/VerifyEmail.dc.html; user-web adapted from SignIn chrome | done | n/a | done | done | E01-S05 #124; 6-digit code; resend with 60s cooldown; non-enumerating |
| 2611080414_sign-in-with-apple | Sign in with Apple | implemented | specs/features/2611080414_sign-in-with-apple.md | specs/architecture/2611080414_sign-in-with-apple.md | specs/openapi/2611080414_sign-in-with-apple.yaml | resources/owezy-web/pages/SignIn.dc.html; resources/owezy-web/pages/SignUp.dc.html; resources/owezy-mobile/prototype/screens/SignIn.dc.html; resources/owezy-mobile/prototype/screens/CreateAccount.dc.html (adapted — no exact Apple-only mock) | done | n/a | done | done | E01-S04 #123; ADR-0007 |
| 2611071719_sign-in-email-password | Sign in email/password | implemented | specs/features/2611071719_sign-in-email-password.md | specs/architecture/2611071719_sign-in-email-password.md | specs/openapi/2611071719_sign-in-email-password.yaml | resources/owezy-web/00 · Sign in-html/SignIn.dc.html; resources/owezy-web/pages/SignIn.dc.html; resources/owezy-mobile/prototype/screens/SignIn.dc.html | done | n/a | done | done | E01-S02 #121; welcome interstitial skipped; remember-me UI-only |
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
