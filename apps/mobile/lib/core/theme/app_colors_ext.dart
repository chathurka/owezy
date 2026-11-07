import 'package:flutter/material.dart';

import 'app_colors.dart';

/// BuildContext extension for theme-aware Owezy colour resolution.
///
/// All widgets in `lib/core/widgets/` MUST use these getters instead of
/// directly importing [AppColorsLight] or [AppColorsDark]. This ensures
/// every widget automatically supports light and dark mode.
///
/// Usage:
/// ```dart
/// Container(color: context.appSurface)
/// Text('Hello', style: TextStyle(color: context.appTextMuted))
/// ```
extension AppBuildContextX on BuildContext {
  Brightness get _brightness => Theme.of(this).brightness;

  /// True when the active theme is dark.
  bool get isDark => _brightness == Brightness.dark;

  // ── Surfaces ──────────────────────────────────────────────────────────────

  Color get appBackground =>
      isDark ? AppColorsDark.background : AppColorsLight.background;

  Color get appSurface =>
      isDark ? AppColorsDark.surface : AppColorsLight.surface;

  Color get appSurfaceRaised =>
      isDark ? AppColorsDark.surfaceRaised : AppColorsLight.surfaceRaised;

  Color get appSubtle =>
      isDark ? AppColorsDark.subtle : AppColorsLight.subtle;

  Color get appTrack =>
      isDark ? AppColorsDark.track : AppColorsLight.track;

  Color get appBorder =>
      isDark ? AppColorsDark.border : AppColorsLight.border;

  Color get appBorderStrong =>
      isDark ? AppColorsDark.borderStrong : AppColorsLight.borderStrong;

  Color get appDivider =>
      isDark ? AppColorsDark.divider : AppColorsLight.divider;

  // ── Text ──────────────────────────────────────────────────────────────────

  Color get appText =>
      isDark ? AppColorsDark.text : AppColorsLight.text;

  Color get appTextSecondary =>
      isDark ? AppColorsDark.textSecondary : AppColorsLight.textSecondary;

  Color get appTextMuted =>
      isDark ? AppColorsDark.textMuted : AppColorsLight.textMuted;

  // ── Brand ─────────────────────────────────────────────────────────────────

  Color get appPrimary =>
      isDark ? AppColorsDark.primary : AppColorsLight.primary;

  Color get appPrimaryPressed =>
      isDark ? AppColorsDark.primaryPressed : AppColorsLight.primaryPressed;

  Color get appPrimaryText =>
      isDark ? AppColorsDark.primaryText : AppColorsLight.primaryText;

  Color get appAccentText =>
      isDark ? AppColorsDark.accentText : AppColorsLight.accentText;

  Color get appPrimarySoft =>
      isDark ? AppColorsDark.primarySoft : AppColorsLight.primarySoft;

  Color get appOnPrimary =>
      isDark ? AppColorsDark.onPrimary : AppColorsLight.onPrimary;

  // ── Money — always pair with sign or label ────────────────────────────────

  Color get appOwed =>
      isDark ? AppColorsDark.owed : AppColorsLight.owed;

  Color get appOwedSoft =>
      isDark ? AppColorsDark.owedSoft : AppColorsLight.owedSoft;

  Color get appOwe =>
      isDark ? AppColorsDark.owe : AppColorsLight.owe;

  Color get appOweSoft =>
      isDark ? AppColorsDark.oweSoft : AppColorsLight.oweSoft;

  Color get appDanger =>
      isDark ? AppColorsDark.danger : AppColorsLight.danger;

  Color get appWarningText =>
      isDark ? AppColorsDark.warningText : AppColorsLight.warningText;

  // ── Inverse ───────────────────────────────────────────────────────────────

  Color get appInverse =>
      isDark ? AppColorsDark.inverse : AppColorsLight.inverse;

  Color get appOnInverse =>
      isDark ? AppColorsDark.onInverse : AppColorsLight.onInverse;

  // ── Charts ────────────────────────────────────────────────────────────────

  Color get appChartPositive =>
      isDark ? AppColorsDark.chartPositive : AppColorsLight.chartPositive;

  Color get appChartNegative =>
      isDark ? AppColorsDark.chartNegative : AppColorsLight.chartNegative;

  Color get appChartBarMuted =>
      isDark ? AppColorsDark.chartBarMuted : AppColorsLight.chartBarMuted;

  List<Color> get appChartSeries =>
      isDark ? AppColorsDark.chartSeries : AppColorsLight.chartSeries;
}
