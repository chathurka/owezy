# ADR-0008: Sign in with Google

**Status:** accepted  
**Date:** 2026-11-08

## Context

ADR-0001 deferred third-party IdPs. ADR-0007 added Sign in with Apple and explicitly left Google requiring its own ADR. E01-S03 requires Google Sign-In on user-web and mobile so users can authenticate without another password, with safe account linking and no Admin exposure.

## Decision

Add **Sign in with Google** as an additive identity provider for end-user (`role: user`) sessions only, without replacing Nest-issued JWTs.

- Clients obtain a Google ID token (native `google_sign_in` / Google Identity Services); they never send Google passwords to Owezy.
- API verifies the Google ID token (JWKS / audience / issuer / expiry) then issues the same access + refresh JWT pair as email/password login (ADR-0001).
- Persist linked identities in existing `oauth_identities` with `provider: google` (soft delete).
- Social-only users may have `users.password_hash = NULL`; email/password login rejects those accounts with `INVALID_CREDENTIALS`.
- Account linking: match by Google `sub` first; else link to an existing active user when Google supplies a **verified** email that matches; else create a new user. Conflicting links return `ACCOUNT_LINK_CONFLICT`.
- Multi-provider: a user may hold both Apple and Google links when each provider verifies the same email ownership; never merge distinct accounts without verification.
- Admin console must not expose Google (or Apple) sign-in.

## Rationale

Mirrors ADR-0007 patterns so clients share one session contract and one OAuth persistence model. Server-side token verification avoids trusting the client. Requiring verified email before link/create prevents account takeover via unverified Google claims.

## Consequences

- Requires Google OAuth client IDs per platform/env (`GOOGLE_CLIENT_IDS` comma-separated audiences).
- JWKS fetch dependency on Google at sign-in time (cache keys; fail closed on verify errors).
- Account-linking edge cases must be covered in tests; never log ID tokens.
- Supersedes ADR-0001’s “no IdP at MVP” for Google in addition to Apple (ADR-0007).
