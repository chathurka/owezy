import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';

/// Owezy progress bar — 6–8h, radius 4.
///
/// Design source: DESIGN_SPEC §2 — Progress bar.
/// - Track: `divider` (or `primarySoft` on Home monthly card).
/// - Fill: `primary`; ≥80% switches to `chartNegative` (orange) for budget warning.
/// - Optionally animated.
///
/// ```dart
/// // Simple progress
/// AppProgressBar(value: 0.66)
///
/// // With budget warning (auto-colours at ≥80%)
/// AppProgressBar(value: 0.84, useBudgetColour: true)
///
/// // Custom height + track colour
/// AppProgressBar(value: 0.5, height: 8, trackColor: context.appPrimarySoft)
/// ```
class AppProgressBar extends StatelessWidget {
  const AppProgressBar({
    super.key,
    required this.value,
    this.height = 6.0,
    this.radius = 4.0,
    this.trackColor,
    this.fillColor,
    this.useBudgetColour = false,
    this.animate = true,
  }) : assert(value >= 0 && value <= 1, 'value must be between 0 and 1');

  /// Progress from 0.0 to 1.0.
  final double value;
  final double height;
  final double radius;

  /// Override track colour. Defaults to `context.appDivider`.
  final Color? trackColor;

  /// Override fill colour. Auto-resolves from [useBudgetColour] if null.
  final Color? fillColor;

  /// When true, switches fill to `chartNegative` at ≥80% — budget warning.
  final bool useBudgetColour;

  /// Animate the fill width change.
  final bool animate;

  @override
  Widget build(BuildContext context) {
    final track = trackColor ?? context.appDivider;

    final Color fill;
    if (fillColor != null) {
      fill = fillColor!;
    } else if (useBudgetColour && value >= 0.80) {
      fill = context.appChartNegative;
    } else {
      fill = context.appPrimary;
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        return Container(
          height: height,
          decoration: BoxDecoration(
            color: track,
            borderRadius: BorderRadius.circular(radius),
          ),
          child: Align(
            alignment: Alignment.centerLeft,
            child: animate
                ? AnimatedContainer(
                    duration: const Duration(milliseconds: 400),
                    curve: Curves.easeOut,
                    width: constraints.maxWidth * value.clamp(0.0, 1.0),
                    height: height,
                    decoration: BoxDecoration(
                      color: fill,
                      borderRadius: BorderRadius.circular(radius),
                    ),
                  )
                : Container(
                    width: constraints.maxWidth * value.clamp(0.0, 1.0),
                    height: height,
                    decoration: BoxDecoration(
                      color: fill,
                      borderRadius: BorderRadius.circular(radius),
                    ),
                  ),
          ),
        );
      },
    );
  }
}
