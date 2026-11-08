# Architecture: Complete initial profile setup

**Status:** approved
**GitHub Issue:** #128 — https://github.com/chathurka/owezy/issues/128
**Feature Spec:** `specs/features/2611080820_complete-initial-profile-setup.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611080820_complete-initial-profile-setup.yaml`
**Design:** `resources/owezy-web/pages/Settings.dc.html`, `resources/owezy-web/screenshots/12-Settings.png`, `resources/owezy-mobile/prototype/screens/Profile.dc.html`, `resources/owezy-mobile/screenshots/light/Profile.png` `(adapted — no exact first-run setup mock)`

---

## Scope

API users/me + profile columns; user-web and mobile first-run profile setup screens; post-auth routing gate. Admin n/a.

---

## Architecture Overview

```
[Auth success] → client checks profileSetupCompletedAt
  null → [Profile setup UI] → PATCH /v1/users/me → home
  set  → home
[Any client] → GET /v1/users/me (refresh profile)
```

---

## Key Design Decisions

- New `UsersModule` with thin controller; shares `UserOrmEntity` / extends auth `User` domain fields rather than duplicating tables.
- Auth module continues to own register/login; users module owns me read/update.
- Export shared User repository updates from auth or inject TypeORM repo in users module with care — AI: UsersService uses Auth `UserRepository` port methods `findActiveById` + new `updateProfile`.
- Auth user response DTOs gain optional profile fields so clients route after login without GET.

---

## NestJS module design (`apps/api/`)

### Module: `UsersModule`

| Layer | File | Responsibility |
|-------|------|----------------|
| Controller | `users.controller.ts` | GET/PATCH `/v1/users/me` |
| Service | `users.service.ts` | Validate + update profile |
| Repository | auth `UserRepository` | Persistence port (+ `updateProfile`) |

**Endpoints:**

| Method | Path | Guard | DTO in | Response |
|--------|------|-------|--------|----------|
| GET | `/v1/users/me` | JWT user | — | `{ data: UserProfile }` |
| PATCH | `/v1/users/me` | JWT user | `UpdateProfileDto` | `{ data: UserProfile }` |

---

## Data model

`users` columns added (nullable):

| Column | Type | Notes |
|--------|------|-------|
| `phone` | varchar(32) null | Optional |
| `payment_handle` | varchar(64) null | Optional |
| `avatar_url` | varchar(2048) null | Reserved; always null this story |
| `profile_setup_completed_at` | timestamptz null | Null = incomplete |

Domain `User` gains matching fields. Soft delete unchanged (`deleted_at`).

---

## Auth / authorization

JWT required. `@Roles(Role.User)` (or any authenticated role that is the subject of the token — AI: allow any authenticated user to read/update **self** only; admin tokens may hit me for their own admin user row but no admin UI). Never update another user id.

---

## Flutter feature design (`apps/mobile/lib/features/profile/`)

- `presentation/pages/profile_setup_page.dart` — form: fullName, optional phone, optional payment handle; Continue CTA; initials avatar.
- `presentation/controllers/profile_setup_controller.dart` — GetxController.
- `data/` Retrofit datasource for GET/PATCH me.
- Route `AppRoutes.profileSetup`; after auth success navigate here when `profileSetupCompletedAt == null`.
- Design: reuse Profile header initials + field chrome from auth CreateAccount / Profile tokens — adapted setup (not full Profile stats screen).

---

## Next.js user-web screen inventory

| Route | Purpose |
|-------|---------|
| `/profile/setup` | First-run setup form (fullName, phone, paymentHandle) |
| Post-auth redirects | login/register/verify/social → setup if incomplete else `/` |

UI adapted from Settings Profile personal-details card (no sidebar chrome on first-run — use auth-style centered card like verify-email).

---

## Files to Modify / Files to Create

**To Modify:**
- `User` domain + ORM + repository + auth response mappers
- Auth client user types (mobile/web)
- Post-auth navigation (mobile Session/controllers; user-web forms)
- `docs/kb-state.md`

**To Create:**
- Migration for profile columns
- `apps/api/src/modules/users/**`
- OpenAPI stub
- Mobile `features/profile/**` + tests
- User-web `features/profile/**` + `/profile/setup` page + tests

---

## Build Order

| Phase | Owner | Work |
|-------|-------|------|
| 0 | Shared | Migration + User domain fields |
| 1 | API | UsersModule + tests + auth payload fields |
| 2 | User web | Setup page + redirect gate + tests |
| 3 | Mobile | Setup page + redirect gate + tests |

---

## Unit test plan

### API (NestJS)

| Scenario | File | Type |
|----------|------|------|
| GET me returns profile | `users.service.spec.ts` | unit |
| PATCH updates fullName + completes setup | `users.service.spec.ts` | unit |
| PATCH empty fullName → validation / domain error | `users.service.spec.ts` | unit |

### Mobile (GetX)

| Scenario | File | Type |
|----------|------|------|
| Continue with valid name calls PATCH and navigates home | `profile_setup_controller_test.dart` | unit |
| Empty name shows validation error | `profile_setup_controller_test.dart` | unit |

### User web

| Scenario | File | Type |
|----------|------|------|
| Submit valid form calls client and redirects | `profile-setup-form.test.tsx` | unit |
| Empty name blocks submit | `profile-setup-form.test.tsx` | unit |

---

## Verification

1. Register → land on setup → Continueneeds fullName → home; `profile_setup_completed_at` set.
2. Login again → skip setup → home.
3. Design fidelity: adapted — Settings personal details / Profile initials chrome.

**Design fidelity:** adapted — no exact first-run mock; personal-details fields + initials avatar matched from Settings/Profile.

---

## Critical Files

| File | Why |
|------|-----|
| `apps/api/src/modules/users/application/users.service.ts` | Profile update rules |
| `apps/mobile/lib/features/profile/presentation/pages/profile_setup_page.dart` | First-run UI |
| `apps/user-web/src/features/profile/presentation/profile-setup-form.tsx` | First-run UI |

---

## Open Questions

- Avatar upload provider — deferred.
- Whether auth responses must always include new fields — yes (AI resolution).

---

## AI Resolutions

- UsersModule + shared UserRepository.updateProfile.
- Auth payloads include profileSetupCompletedAt + phone + paymentHandle + avatarUrl.
- First-run UI adapted (no dedicated mock).
- Admin web out of scope.
