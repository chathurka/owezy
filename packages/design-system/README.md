# @owezy/design-system

Single source of truth for Owezy colours, typography, spacing, radius, and shadows across all three surfaces: **user-web**, **admin-web**, and **mobile** (Flutter).

Token values are sourced from the Claude-generated design exports in `resources/`. Do not edit values here; update `resources/` first and re-sync.

---

## Design principles

- **Calm surfaces, one loud colour.** `background → surface → surface-raised` carry content. `primary` (`#635BDB`) is reserved for the one CTA, the active place, and chart series 1.
- **Money is never colour-only.** Always pair `owed` / `owe` with a sign (`+` / `−`) or an explicit label ("owed to you" / "you owe"). Neutral totals use `text`.
- **Borders in light, steps in dark.** Light cards = `surface` + 1px `border`. Dark drops shadows and uses surface steps.
- **Inter everywhere, tabular figures for numbers.** `font-variant-numeric: tabular-nums` on all amount styles.

---

## Usage — user-web (Next.js)

```css
/* globals.css */
@import '@owezy/design-system/user/tokens.css';
```

```css
/* In component CSS */
.card   { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-24); }
.amount { color: var(--owed); } /* always pair with + or a label */
```

```ts
/* In JS (chart configs, canvas, inline styles only) */
import { colorsLight, colorsDark, chart } from '@owezy/design-system/user';
```

### Theme toggle

```html
<html data-theme="light">   <!-- or "dark"; omit to follow OS preference -->
```

---

## Usage — admin-web (Next.js)

```css
/* globals.css */
@import '@owezy/design-system/admin/tokens.css';
```

Admin uses denser type (14px body vs 15px on user-web) and additional status tokens: `--danger`, `--danger-soft`, `--info`, `--info-soft`. `.type-kpi` and `.type-mono` are admin-only.

```ts
import { colorsLight, colorsDark, chart, typography } from '@owezy/design-system/admin';
```

---

## Typography utility classes

Both web surfaces expose `.type-*` classes in their token CSS. Use these instead of inline font properties:

| Class | Size / Weight | Use |
|---|---|---|
| `.type-display` | 40 / 800 | Hero balances |
| `.type-amount-lg` | 30 / 800 | Split totals, month spend (user-web) |
| `.type-kpi` | 28 / 800 | KPI card values (admin-web) |
| `.type-amount` | 24 / 800 | Stat card figures |
| `.type-title` | 28 / 800 | Page titles (user) · 24 (admin) |
| `.type-headline` | 17 / 700 | Card and section headers |
| `.type-body-strong` | 15 / 700 · 14 (admin) | List titles, button labels |
| `.type-body` | 15 / 600 · 14 (admin) | Row text, form values |
| `.type-label` | 13 / 600 | Chips, form labels |
| `.type-caption` | 12 / 500 | Meta lines, axis labels |
| `.type-micro` | 11 / 600 | Badge text, notes |
| `.type-overline` | 12 / 700 uppercase | Section dividers |
| `.type-mono` | 12 / 500 JetBrains Mono | IDs, JSON, IPs (admin-web) |

---

## Usage — mobile (Flutter)

Dart mirrors live in `apps/mobile/lib/core/theme/`:

```dart
// In your widget
AppColors.primary           // brand violet
AppColorsLight.owed         // green for positive amounts (light theme)
AppColorsDark.owed          // lighter green for dark theme
AppTextStyles.display       // 40 / 800 / tabular-nums
AppSpacing.page             // 20dp page edge padding
AppRadius.card              // 18dp content card
AppTheme.light              // full light ThemeData
AppTheme.dark               // full dark ThemeData
```

```dart
// In GetMaterialApp
GetMaterialApp(
  theme: AppTheme.light,
  darkTheme: AppTheme.dark,
  themeMode: ThemeMode.system,
  ...
);
```

See `flutter/README.md` for a full token-to-Dart mapping.

---

## Token files

| File | Purpose |
|---|---|
| `user/tokens.css` | CSS variables — user-web (light + dark + static) |
| `user/tokens.ts` | TypeScript mirrors for user-web |
| `user/tokens.json` | Source JSON (from `resources/owezy-web/design-tokens/`) |
| `admin/tokens.css` | CSS variables — admin-web (light + dark + static) |
| `admin/tokens.ts` | TypeScript mirrors for admin-web |
| `admin/tokens.json` | Source JSON (from `resources/owezy-admin-console/`) |
| `mobile/tokens.json` | Source JSON (from `resources/owezy-mobile/design-tokens/`) |
| `mobile/theme.ts` | TypeScript theme export (reference / docs) |
| `mobile/tokens.css` | CSS reference (for web previews of mobile tokens) |
| `tokens.css` | Alias → `user/tokens.css` (backwards compat) |
| `tokens.ts` | Re-export → `user/tokens.ts` (backwards compat) |

---

## Money colour rule

```
✓  <span class="type-amount" style="color: var(--owed)">+$48.00</span>
✓  <span class="type-label">You are owed</span>
   <span class="type-amount" style="color: var(--owed)">$48.00</span>

✗  <span style="color: var(--owed)">$48.00</span>  // colour alone — forbidden
```

Same rule applies in Dart:
```dart
// Good
Text('+\$48.00', style: AppTextStyles.amount.copyWith(color: AppColorsLight.owed))

// Bad — no sign or label
Text('\$48.00', style: AppTextStyles.amount.copyWith(color: AppColorsLight.owed))
```
