import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_text_styles.dart';

/// Badge semantic from DESIGN_SPEC §2 — Badge.
enum AppBadgeVariant {
  /// "Settled" / money owed to you — green.
  owed,

  /// "Owes" / you owe — orange.
  owe,

  /// "Paid" / primary action completed — violet.
  primary,

  /// "Free plan" / neutral status — surface.
  neutral,

  /// "Pending" — amber warning tones.
  warning,
}

/// Owezy status badge — 11/700, padding 4/9, radius 10.
///
/// Design source: DESIGN_SPEC §2 — Badge.
/// Variants: owed (Settled), owe (Owes), primary (Paid), neutral (Free plan).
///
/// ```dart
/// AppBadge(label: 'Settled', variant: AppBadgeVariant.owed)
/// AppBadge(label: 'Owes', variant: AppBadgeVariant.owe)
/// AppBadge(label: 'Paid', variant: AppBadgeVariant.primary)
/// ```
class AppBadge extends StatelessWidget {
  const AppBadge({
    super.key,
    required this.label,
    this.variant = AppBadgeVariant.neutral,
  });

  final String label;
  final AppBadgeVariant variant;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = _colors(context, variant);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        label,
        style: AppTextStyles.micro.copyWith(
          fontWeight: FontWeight.w700,
          color: fg,
          height: 1,
        ),
      ),
    );
  }

  static (Color, Color) _colors(BuildContext context, AppBadgeVariant v) =>
      switch (v) {
        AppBadgeVariant.owed    => (context.appOwedSoft, context.appOwed),
        AppBadgeVariant.owe     => (context.appOweSoft, context.appOwe),
        AppBadgeVariant.primary => (context.appPrimarySoft, context.appPrimaryText),
        AppBadgeVariant.neutral => (context.appSubtle, context.appTextMuted),
        AppBadgeVariant.warning => (context.appOweSoft, context.appWarningText),
      };
}
