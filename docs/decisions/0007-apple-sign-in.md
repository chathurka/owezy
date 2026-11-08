# ADR-0007: Sign in with Apple

**Status:** accepted  
**Date:** 2026-11-08

## Context

ADR-0001 deferred third-party IdPs (including Google OAuth) at MVP. E01-S04 requires Sign in with Apple on user-web and mobile so users can authenticate with Apple identity, including Hide My Email (private relay) and safe account linking. Admin remains email/password only (E01-S08).

## Decision

Add **Sign in with Apple** as an additive identity provider for end-user (`role: user`) sessions only, without replacing Nest-issued JWTs.

- Clients obtain an Apple identity token (native ASAuthorization / Apple JS); they never send Apple passwords to Owezy.
- API verifies the Apple identity token (JWKS / audience / issuer / expiry) then issues the same access + refresh JWT pair as email/password login (ADR-0001).
- Persist linked identities in `oauth_identities` (`provider`, `provider_subject`, `user_id`, soft delete).
- Social-only users may have `users.password_hash = NULL`; email/password login rejects those accounts with the same safe `INVALID_CREDENTIALS`.
- Account linking: match by Apple `sub` first; else link to an existing active user when Apple supplies a verified email that matches; else create a new user. Conflicting links return a stable error (`ACCOUNT_LINK_CONFLICT`).
- Private relay emails are treated as first-class verified addresses when Apple asserts them; do not invent alternate contact emails.
- Google Sign-In remains out of scope (separate ADR if product requires it).
- Admin console must not expose Apple (or Google) sign-in.

## Rationale

Keeps the existing JWT contract for all surfaces while satisfying Apple’s identity requirements. Verifying tokens server-side avoids trusting the client. Nullable password hashes allow social-only accounts without fake credentials.

## Consequences

- Requires Apple Developer / Services ID configuration (`APPLE_CLIENT_ID` / bundle IDs) per environment.
- JWKS fetch dependency on Apple at sign-in time (cache keys; fail closed on verify errors).
- Account-linking edge cases must be covered in tests; never log identity tokens or emails in a way that leaks PII beyond existing auth patterns.
- Supersedes ADR-0001’s “no IdP at MVP” only for Apple; Google still requires its own ADR.
