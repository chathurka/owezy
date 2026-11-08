# Architecture: Recover and reset password

**Status:** approved
**GitHub Issue:** #125 — https://github.com/chathurka/owezy/issues/125
**Feature Spec:** `specs/features/2611080436_recover-reset-password.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611080436_recover-reset-password.yaml`
**Design:** adapted from `resources/owezy-web/pages/SignIn.dc.html`, `resources/owezy-mobile/prototype/screens/SignIn.dc.html` `(adapted — no exact forgot/reset mock)`

---

## Scope

API forgot/reset; user-web forgot + reset pages; mobile forgot + reset screens. Admin n/a.

## Architecture Overview

```
[Forgot form] → POST /v1/auth/password/forgot → create hashed token → EmailPort
[Reset form]  → POST /v1/auth/password/reset  → consume token → update password_hash
```

## Key Design Decisions

- Always 204 on forgot.
- `password_reset_tokens` table; single-use via `consumed_at`.
- Password rules match register (≥8, upper, digit).
- After reset, redirect to login (JWT revocation Phase 2).
- Extend EmailPort with `sendPasswordResetEmail`.

## NestJS endpoints

| Method | Path | Response |
|--------|------|----------|
| POST | `/v1/auth/password/forgot` | 204 |
| POST | `/v1/auth/password/reset` | 200 `{ data: { ok: true } }` |

## Data model

`password_reset_tokens`: id, user_id, token_hash, expires_at, consumed_at, created_at. Soft-delete column `deleted_at` for syncability consistency.

## Flutter / User-web

Forgot + reset pages/routes; wire SignIn forgot links; BFF proxies.

## Build Order

API → user-web → mobile

## Unit test plan

API: forgot sends/skips; reset valid/invalid/weak. Mobile/web: form validation + success path.

## Verification

1. Forgot known email sends link; unknown still 204.
2. Reset updates password; old password fails login; new works.
3. Design fidelity: adapted from SignIn chrome.

## AI Resolutions

- Adapted UI; cooldown 60s; opaque hex token in email link (web) + show code optional — use opaque URL token (32-byte hex) for reset links (not 6-digit) since no OTP mock for reset.
