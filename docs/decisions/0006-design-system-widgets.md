# ADR-0006 — Design System Widgets & Light/Dark Theme

**Status:** Accepted  
**Date:** 2026-11-07  
**Authors:** AI-assisted  

---

## Context

`packages/design-system/` already ships fully-specified light/dark CSS variables for
user-web and admin-web surfaces and mirrored Dart token files for Flutter. However:

- No shared widget/component libraries exist on any surface.
- Mobile `GetMaterialApp` wired only `AppTheme.light`; `AppTheme.dark` was defined but unused.
- Web apps import token CSS but set no `data-theme` attribute, preventing explicit dark mode.
- Feature code duplicated UI chrome (register form button, field, card) with hardcoded light colors.
- `AppTextStyles` constants held light-locked `color:` values that break in dark mode.

This ADR documents how the design system widget layer is implemented across all three surfaces.

---

## Decision

### 1. Token ownership — no change

Surface tokens remain in `packages/design-system/{user,admin,mobile}/`. The source of truth
is `resources/` handoffs. No codegen; Dart mirrors are updated manually per `flutter/README.md`.

### 2. Widget location — per surface

| Surface | Location | Convention |
|---------|----------|-----------|
| Mobile (Flutter) | `apps/mobile/lib/core/widgets/` | `app_<name>.dart`, `app_` prefix |
| User-web | `apps/user-web/src/shared/ui/` | `<name>.tsx` + `<name>.module.css` |
| Admin-web | `apps/admin-web/src/components/` | `<name>.tsx` + `<name>.module.css` |

React components inside `@owezy/design-system` are **not** introduced — that package remains
tokens-only.

### 3. Dark mode — web

CSS variables in both `user/tokens.css` and `admin/tokens.css` already flip on
`[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`.

Each web surface adds:
- A small inline `<script>` in `<head>` that reads `localStorage('owezy-theme')` and sets
  `data-theme` before first paint (prevents FOUC).
- A client `ThemeProvider` component (at `src/core/theme/theme-provider.tsx`) that tracks
  mode state, applies `data-theme` reactively, and exports `useTheme()`.
- Root `app/layout.tsx` wraps `<body>` children in `<ThemeProvider>`.

No server-side cookie for initial theme is used (localStorage is sufficient; auth pages always
appear after the script runs). Do not introduce `next-themes` or any third-party theming lib.

### 4. Dark mode — mobile

`GetMaterialApp` is updated to pass both `theme: AppTheme.light` and
`darkTheme: AppTheme.dark`. `themeMode` is driven by a `ThemeController` GetxController
registered in `InitialBinding`, defaulting to `ThemeMode.system`.

The Profile/Preferences screen will call `Get.find<ThemeController>().setMode(...)` when it
is built. Persistence across restarts (via `flutter_secure_storage` or `GetStorage`) is deferred
until the Profile feature spec.

### 5. Color resolution — mobile

A `BuildContext` extension (`AppBuildContextX` in `app_colors_ext.dart`) provides
theme-aware color getters (e.g., `context.appSurface`, `context.appTextMuted`). All new
widgets in `lib/core/widgets/` MUST use this extension instead of hardcoding
`AppColorsLight.*` or `AppColorsDark.*`.

`AppTextStyles` constant `color:` properties are removed so styles inherit the theme's
`textTheme.apply` colors. Callers that need semantic coloring (muted, money, danger) apply
`copyWith(color: context.app*)` explicitly.

### 6. Elevation policy

Follows the design spec:
- **Light:** 1px `border` on cards; decorative shadows on hero card, FAB, primary CTA only.
- **Dark:** suppress all decorative shadows; use surface steps (`surfaceRaised`) for depth.

Shared widgets accept a `shadows` parameter for the few cases that need explicit shadow
control; otherwise they query brightness and apply the policy automatically.

### 7. Missing mobile tokens — added

`apps/mobile/lib/core/theme/app_shadows.dart` mirrors `shadow.*` from `tokens.json`.
Icon size constants (`AppIconSize`) are added to `app_spacing.dart`.

### 8. Money colour rule — enforced in `AppAmount` widget

`AppAmount` (mobile) and `amount.tsx` (web) require both a `value` and an `AmountSign`
(`positive` / `negative` / `neutral`). Positive/negative amounts MUST carry a `+`/`−` prefix
or an explicit label; the widget enforces the sign programmatically, never relying on color alone.

### 9. Component scope — this pass

**Primitive set (all three surfaces):** Button (primary/secondary/ghost), IconButton,
TextField, Switch, Avatar, Badge, Alert, Chip, Card, Amount.

**Mobile additional (DESIGN_SPEC §2):** HeroCard, GroupCard, ListRow, SegmentedControl,
UnderlineTabs, ProgressBar, AmountInput, BottomTabBar + FAB.

**Deferred:** chart widgets, admin DataTable/KpiCard/SidebarNav, theme toggle UI on Profile.

---

## Consequences

- Features must import primitives from the kit; duplicating chrome locally is a code-review
  violation.
- `AppColorsLight.*` / `AppColorsDark.*` are still accessible for the rare explicit override;
  the convention is to avoid them in widget code.
- `AppTextStyles` constants have no color — callers that relied on the old implicit light color
  must add `copyWith(color: context.appText)` or similar. The register form refactor in Phase 3
  demonstrates the pattern.
