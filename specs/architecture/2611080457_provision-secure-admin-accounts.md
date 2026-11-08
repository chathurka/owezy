# Architecture: Provision and secure Admin accounts

**Status:** approved
**GitHub Issue:** #127 — https://github.com/chathurka/owezy/issues/127
**Feature Spec:** `specs/features/2611080457_provision-secure-admin-accounts.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611080457_provision-secure-admin-accounts.yaml`
**Design:** `resources/owezy-admin-console/Sign in — Light-html/Login.dc.html`, `resources/owezy-admin-console/Two-step verification — Light-html/Login.dc.html`, Access Denied adapted `(adapted — no exact Access Denied mock)`

---

## Scope

API admin provision + MFA challenge; admin-web login, MFA verify, access-denied. User-web/mobile n/a.

## Architecture Overview

```
[Admin Login] → BFF /api/auth/login → POST /v1/auth/login
   | role!=admin → reject
   | mfaRequired → /login/mfa → POST /v1/auth/mfa/verify → cookies
[Admin] → POST /v1/admin/accounts (RolesGuard admin)
[Bootstrap] → onModuleInit if zero admins + env set
```

## Key Design Decisions

- Extend login response with optional `mfaRequired`/`mfaToken`.
- `otplib` for TOTP.
- Admin BFF login checks `user.role === 'admin'` before setting cookies.
- Middleware already enforces admin role (E01-S07 session-expired).

## Endpoints

| Method | Path | Guard |
|--------|------|-------|
| POST | `/v1/admin/accounts` | JWT + admin |
| POST | `/v1/auth/mfa/setup` | JWT + admin |
| POST | `/v1/auth/mfa/verify` | Public (mfaToken) |
| POST | `/v1/auth/login` | Public (extended) |

## Build Order

API → admin-web

## Unit test plan

API provision, MFA challenge, bootstrap; admin login form tests.

## AI Resolutions

- Access Denied adapted.
- MFA optional for bootstrap admin.
- Login OpenAPI extended carefully without breaking user clients (optional fields).
