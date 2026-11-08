# Architecture: Manage profile and preferences

**Status:** approved
**GitHub Issue:** #132 — https://github.com/chathurka/owezy/issues/132
**Feature Spec:** `specs/features/2611080838_manage-profile-and-preferences.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611080838_manage-profile-and-preferences.yaml`
**Design:** `resources/owezy-web/pages/Settings.dc.html`, `resources/owezy-web/screenshots/12-Settings.png`, `resources/owezy-mobile/prototype/screens/Profile.dc.html`, `resources/owezy-mobile/screenshots/light/Profile.png`

---

## Scope

User-web Settings page + mobile Profile edit for name/phone/handle/currency/language. API already done.

## Screens

| Surface | Route | Notes |
|---------|-------|-------|
| user-web | `/settings` | Profile form + prefs selects; Save |
| mobile | `/profile` | Profile mock layout; Edit → save fields |

## Build Order

user-web → mobile

## Unit tests

Save success path; validation empty name.

## AI Resolutions

- OpenAPI documents reuse of GET/PATCH me only.
- Non-editable mock chrome limited to header/avatar initials.
