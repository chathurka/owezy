# Architecture: Choose preferred language

**Status:** approved
**GitHub Issue:** #130 — https://github.com/chathurka/owezy/issues/130
**Feature Spec:** `specs/features/2611080831_choose-preferred-language.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611080831_choose-preferred-language.yaml`
**Design:** adapted from currency select on profile setup `(adapted — no language mock in Settings/Profile)`

---

## Scope

Add `preferred_locale` column; PATCH me accepts `preferredLocale`; setup UIs expose language select; clients apply locale with en fallback.

## NestJS

- Migration `preferred_locale` varchar(16) default `'en'`.
- Extend User domain/ORM + updateProfile + UserProfile response.
- Allow-list: `en`, `si`.

## Flutter

- `app_si.arb` (initially copy of en).
- `supportedLocales` includes `si`.
- Profile setup language dropdown; after save set Get.updateLocale / locale override.

## User-web

- `messages/si.ts` (mirror en initially).
- Locale resolution helper; persist via profile; apply on document/`t()` lookup with en fallback.

## Build Order

API → clients

## Unit tests

API: update preferredLocale; reject invalid. Mobile/web: include preferredLocale in setup submit payload.

## AI Resolutions

- si catalogs duplicate en for MVP structure.
- Design adapted — no language mock.
