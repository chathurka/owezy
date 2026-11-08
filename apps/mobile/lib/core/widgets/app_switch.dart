import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_dimensions.dart';
import '../theme/app_text_styles.dart';

/// Owezy switch — 48×28, `primary` on / `borderStrong` off.
///
/// Design source: DESIGN_SPEC §2 — Switch.
/// Optionally renders a leading label and caption (used in Preferences list rows).
///
/// ```dart
/// AppSwitch(value: isDark, onChanged: (v) => controller.toggleDark(v))
///
/// AppSwitch(
///   label: 'Push notifications',
///   caption: 'Get alerts for new activity',
///   value: notificationsEnabled,
///   onChanged: (v) => controller.toggleNotifications(v),
/// )
/// ```
class AppSwitch extends StatelessWidget {
  const AppSwitch({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.caption,
  });

  final bool value;
  final ValueChanged<bool>? onChanged;
  final String? label;
  final String? caption;

  @override
  Widget build(BuildContext context) {
    final sw = Switch(
      value: value,
      onChanged: onChanged,
      thumbColor: WidgetStateProperty.all(Colors.white),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) return context.appPrimary;
        return context.appBorderStrong;
      }),
      trackOutlineColor: WidgetStateProperty.all(Colors.transparent),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );

    if (label == null && caption == null) return sw;

    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (label != null)
                Text(
                  label!,
                  style: AppTextStyles.bodyStrong.copyWith(color: context.appText),
                ),
              if (caption != null)
                Text(
                  caption!,
                  style: AppTextStyles.caption.copyWith(color: context.appTextMuted),
                ),
            ],
          ),
        ),
        const SizedBox(width: AppDimensions.size12),
        sw,
      ],
    );
  }
}
