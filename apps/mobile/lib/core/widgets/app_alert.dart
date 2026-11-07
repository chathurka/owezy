import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_text_styles.dart';

/// Alert variant from DESIGN_SPEC §2.
enum AppAlertVariant {
  /// Warning — oweSoft background + warningText foreground.
  warning,

  /// Success — owedSoft background + owed foreground.
  success,

  /// Info — primarySoft background + primaryText foreground.
  info,

  /// Danger — danger colour on oweSoft (destructive confirmation).
  danger,
}

/// Owezy inline alert — radius 18, padding 12/14.
///
/// Design source: DESIGN_SPEC §2 — Alert.
/// Used for budget warnings, form errors, settlement prompts.
///
/// ```dart
/// AppAlert(
///   message: 'You are 80% through your food budget.',
///   variant: AppAlertVariant.warning,
/// )
/// AppAlert(
///   message: 'Payment of \$145 recorded.',
///   variant: AppAlertVariant.success,
///   onDismiss: () {},
/// )
/// ```
class AppAlert extends StatelessWidget {
  const AppAlert({
    super.key,
    required this.message,
    this.variant = AppAlertVariant.warning,
    this.leadingIcon,
    this.onDismiss,
  });

  final String message;
  final AppAlertVariant variant;
  final IconData? leadingIcon;
  final VoidCallback? onDismiss;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = _colors(context, variant);
    final icon = leadingIcon ?? _defaultIcon(variant);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: fg),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: AppTextStyles.body.copyWith(
                fontSize: 14,
                color: fg,
              ),
            ),
          ),
          if (onDismiss != null) ...[
            const SizedBox(width: 8),
            GestureDetector(
              onTap: onDismiss,
              child: Icon(Icons.close, size: 16, color: fg),
            ),
          ],
        ],
      ),
    );
  }

  static (Color, Color) _colors(BuildContext context, AppAlertVariant v) =>
      switch (v) {
        AppAlertVariant.warning => (context.appOweSoft, context.appWarningText),
        AppAlertVariant.success => (context.appOwedSoft, context.appOwed),
        AppAlertVariant.info    => (context.appPrimarySoft, context.appPrimaryText),
        AppAlertVariant.danger  => (context.appOweSoft, context.appDanger),
      };

  static IconData _defaultIcon(AppAlertVariant v) => switch (v) {
        AppAlertVariant.warning => Icons.warning_amber_rounded,
        AppAlertVariant.success => Icons.check_circle_outline,
        AppAlertVariant.info    => Icons.info_outline,
        AppAlertVariant.danger  => Icons.error_outline,
      };
}
