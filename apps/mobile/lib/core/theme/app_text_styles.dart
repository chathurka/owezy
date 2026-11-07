import 'package:flutter/material.dart';

import 'app_colors.dart';

/// Owezy typography scale — sourced from packages/design-system/mobile/tokens.json.
/// Font is Inter (loaded via google_fonts in AppTheme). All amount styles use
/// FontFeature.tabularFigures() for consistent number widths.
///
/// Mobile keeps 15px body (vs 14px on admin-web) per the design spec.
abstract final class AppTextStyles {
  static const _tabular = [FontFeature.tabularFigures()];

  // ── Display / figures ───────────────────────────────────────────────────────

  /// Hero balances and expense totals. 40 / 800 / −1.4px lh 1.1
  static const TextStyle display = TextStyle(
    fontSize: 40,
    fontWeight: FontWeight.w800,
    height: 1.1,
    letterSpacing: -1.4,
    fontFeatures: _tabular,
    color: AppColors.textPrimary,
  );

  /// Split total, month spend, budget ring centre. 30 / 800 / −1.0px
  static const TextStyle amountLg = TextStyle(
    fontSize: 30,
    fontWeight: FontWeight.w800,
    height: 1.1,
    letterSpacing: -1.0,
    fontFeatures: _tabular,
    color: AppColors.textPrimary,
  );

  /// Stat cards and card figures. 24 / 800 / −0.6px
  static const TextStyle amount = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w800,
    height: 1.2,
    letterSpacing: -0.6,
    fontFeatures: _tabular,
    color: AppColors.textPrimary,
  );

  // ── Text ────────────────────────────────────────────────────────────────────

  /// Page titles (Groups, Activity, Insights). 28 / 800 / −0.8px
  static const TextStyle title = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.w800,
    height: 1.15,
    letterSpacing: -0.8,
    color: AppColors.textPrimary,
  );

  /// Card and section titles, modal headers. 17 / 700 / −0.2px
  static const TextStyle headline = TextStyle(
    fontSize: 17,
    fontWeight: FontWeight.w700,
    height: 1.3,
    letterSpacing: -0.2,
    color: AppColors.textPrimary,
  );

  /// List titles, group names, button labels. 15 / 700
  static const TextStyle bodyStrong = TextStyle(
    fontSize: 15,
    fontWeight: FontWeight.w700,
    height: 1.35,
    color: AppColors.textPrimary,
  );

  /// Row text and form values. 15 / 600
  static const TextStyle body = TextStyle(
    fontSize: 15,
    fontWeight: FontWeight.w600,
    height: 1.35,
    color: AppColors.textPrimary,
  );

  /// Chips, segment items, secondary labels, table cells. 13 / 600
  static const TextStyle label = TextStyle(
    fontSize: 13,
    fontWeight: FontWeight.w600,
    height: 1.35,
    color: AppColors.textPrimary,
  );

  /// Meta lines under titles, axis labels. 12 / 500
  static const TextStyle caption = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 1.35,
    color: AppColorsLight.textMuted,
  );

  /// Notes under amounts, badges, nav labels on mobile. 11 / 600
  static const TextStyle micro = TextStyle(
    fontSize: 11,
    fontWeight: FontWeight.w600,
    height: 1.3,
    color: AppColorsLight.textMuted,
  );

  /// Uppercase section dividers (TODAY, ACCOUNT). 12 / 700 / +0.5px
  static const TextStyle overline = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w700,
    height: 1.3,
    letterSpacing: 0.5,
    color: AppColorsLight.textMuted,
  );

  // ── App-bar title ───────────────────────────────────────────────────────────

  /// Navigation/AppBar titles. 17 / 700 (alias of [headline]).
  static const TextStyle navTitle = TextStyle(
    fontSize: 17,
    fontWeight: FontWeight.w700,
    height: 1.3,
    letterSpacing: -0.2,
    color: AppColors.textPrimary,
  );

  // ── Backwards-compat aliases (pre-design-system names) ─────────────────────
  static const TextStyle screenTitle = title;
  static const TextStyle sectionTitle = headline;
  static const TextStyle displayLarge = display;
  static const TextStyle bodyMedium = bodyStrong;

  // ── Convenience copy-with helpers ───────────────────────────────────────────

  /// Returns [style] with [color] applied — use for semantic colouring.
  static TextStyle colored(TextStyle style, Color color) =>
      style.copyWith(color: color);

  /// Returns [style] with muted text colour.
  static TextStyle muted(TextStyle style) =>
      style.copyWith(color: AppColorsLight.textMuted);
}
