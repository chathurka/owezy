# Architecture: Sign out and expired sessions

**Status:** approved
**GitHub Issue:** #126 — https://github.com/chathurka/owezy/issues/126
**Feature Spec:** `specs/features/2611080449_sign-out-expired-sessions.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611080449_sign-out-expired-sessions.yaml`
**Design:** adapted from SignIn (user/admin) — session-expired banner `(adapted — no exact Session Expired mock)`

---

## Scope

API refresh + logout revocation; user-web + admin-web BFF refresh wiring + expired messaging; mobile Dio refresh interceptor + SessionService.

## Architecture Overview

```
[Client] --access--> API
   |401
   v
[BFF/Dio refresh] --refreshToken--> POST /v1/auth/refresh
   |ok → retry   |fail → clear session → login?reason=session-expired
[Sign out] → clear local + POST /v1/auth/logout { refreshToken } → revoke hash
```

## Key Design Decisions

- `refresh_tokens` table: user_id, token_hash, expires_at, revoked_at, deleted_at.
- Issue refresh on login/register/apple; store hash.
- Refresh rotates: revoke old, issue new pair.
- Logout revokes presented refresh hash.

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| POST | `/v1/auth/refresh` | Public; body refreshToken |
| POST | `/v1/auth/logout` | Optional body refreshToken; 204 |

## Build Order

API → user-web → admin-web → mobile

## Unit test plan

API refresh/logout tests; mobile SessionService / interceptor tests if present; web middleware/login banner tests.

## AI Resolutions

- Adapted expired UX via login query param.
- Rotate refresh on each refresh call.
