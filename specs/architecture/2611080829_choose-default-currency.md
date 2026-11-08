# Architecture: Choose default currency

**Status:** approved
**GitHub Issue:** #129 — https://github.com/chathurka/owezy/issues/129
**Feature Spec:** `specs/features/2611080829_choose-default-currency.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611080829_choose-default-currency.yaml`
**Design:** `resources/owezy-web/pages/Settings.dc.html` (Preferences currency), `resources/owezy-mobile/prototype/screens/Profile.dc.html` (Default currency row) `(adapted into profile setup)`

---

## Scope

Extend PATCH `/v1/users/me` with `defaultCurrency`; expose selector on mobile + user-web profile setup. Admin n/a.

## Key Design Decisions

- Allow-list enum matches register: USD|EUR|GBP|LKR|INR.
- Preference-only write; no expense tables touched.
- Shared constant `ALLOWED_CURRENCIES` in API DTO validation.

## NestJS

| Method | Path | Change |
|--------|------|--------|
| PATCH | `/v1/users/me` | Accept optional `defaultCurrency` |

## Flutter / User-web

Add currency dropdown/select to profile setup forms; persist via existing profile client.

## Build Order

API → user-web → mobile

## Unit test plan

| Scenario | Surface |
|----------|---------|
| PATCH valid currency updates | API |
| PATCH invalid currency 422 | API |
| Setup form includes currency in payload | web + mobile |

## Verification

1. Change currency on setup → GET me returns new code.
2. No expense rows modified (N/A until expenses exist).

**Design fidelity:** adapted — Preferences/Profile currency chrome into setup select.

## AI Resolutions

- INR kept despite Settings mock omitting it.
- Full Settings preferences UI deferred to #132.
