# Flutter token mirrors

Dart mirrors of `packages/design-system/mobile/tokens.json` live in
`apps/mobile/lib/core/theme/`. Update those files whenever `mobile/tokens.json`
changes — the JSON is the single source of truth.

## Files

| Dart file | Mirrors | Contents |
|-----------|---------|----------|
| `app_colors.dart` | `color.*` | `AppColorsLight`, `AppColorsDark`, `AppColors` |
| `app_spacing.dart` | `space.*`, `layout.*` | `AppSpacing` with `s1`–`s8`, `page`, `navHeight` |
| `app_radius.dart` | `radius.*` | `AppRadius` with raw doubles + named `BorderRadius` |
| `app_text_styles.dart` | `typography.*` | `AppTextStyles` — display → overline |
| `app_theme.dart` | — | `AppTheme.light` + `AppTheme.dark` via `ThemeData` |
| `app_assets.dart` | — | Asset path constants (logos, icons) |

## Token → Dart mapping

### Colours

```
tokens.json color.light.*  →  AppColorsLight.*
tokens.json color.dark.*   →  AppColorsDark.*
tokens.json color.chart.*  →  AppColorsLight.chartSeries / AppColorsDark.chartSeries
tokens.json color.category.food.light  →  AppColorsLight.catFoodBg / catFoodFg
tokens.json color.avatar.pink.light    →  AppColorsLight.avatarPinkBg / avatarPinkFg
```

### Spacing (px → dp, 1:1)

```
space.1 → AppSpacing.s1  (4dp)
space.2 → AppSpacing.s2  (8dp)
space.3 → AppSpacing.s3  (12dp)
space.4 → AppSpacing.s4  (16dp)
space.5 → AppSpacing.s5  (20dp)   ← also AppSpacing.page
space.6 → AppSpacing.s6  (24dp)
space.8 → AppSpacing.s8  (32dp)
layout.bottomNavHeight → AppSpacing.navHeight (88dp)
layout.screenPaddingX  → AppSpacing.page (20dp)
```

### Radius (px → dp, 1:1)

```
radius.xs   → AppRadius.xs    (8dp)
radius.sm   → AppRadius.sm    (12dp)
radius.md   → AppRadius.md    (14dp)
radius.lg   → AppRadius.lg    (16dp)
radius.xl   → AppRadius.xl    (18dp)
radius.2xl  → AppRadius.r2xl  (22dp)
radius.3xl  → AppRadius.r3xl  (24dp)
radius.4xl  → AppRadius.r4xl  (28dp)
radius.pill → AppRadius.pill  (999dp)
```

### Typography (px → sp for fontSize, ratio for height)

```
typography.display    → AppTextStyles.display    (40sp / w800 / lh1.1 / -1.4px)
typography.amountLg   → AppTextStyles.amountLg   (30sp / w800 / lh1.1 / -1.0px)
typography.amount     → AppTextStyles.amount     (24sp / w800 / lh1.2 / -0.6px)
typography.title      → AppTextStyles.title      (28sp / w800 / lh1.15 / -0.8px)
typography.headline   → AppTextStyles.headline   (17sp / w700 / lh1.3 / -0.2px)
typography.bodyStrong → AppTextStyles.bodyStrong (15sp / w700 / lh1.35)
typography.body       → AppTextStyles.body       (15sp / w600 / lh1.35)
typography.label      → AppTextStyles.label      (13sp / w600 / lh1.35)
typography.caption    → AppTextStyles.caption    (12sp / w500 / lh1.35)
typography.micro      → AppTextStyles.micro      (11sp / w600 / lh1.3)
typography.overline   → AppTextStyles.overline   (12sp / w700 / lh1.3 / +0.5px uppercase)
```

## Usage

```dart
// Wire themes in GetMaterialApp
GetMaterialApp(
  theme: AppTheme.light,
  darkTheme: AppTheme.dark,
  themeMode: ThemeMode.system,
);

// Use tokens in widgets — never inline hex values
Container(
  color: AppColorsLight.surface,
  padding: const EdgeInsets.all(AppSpacing.s5),
  decoration: BoxDecoration(borderRadius: AppRadius.card),
  child: Text('Groups', style: AppTextStyles.title),
);

// Theme-aware colour resolution via context
final cs = Theme.of(context).colorScheme;
// cs.primary       → AppColors.primary (#635BDB both themes)
// cs.surface       → light/dark surface per active theme
// cs.error         → owed/owe danger colour per active theme
```
