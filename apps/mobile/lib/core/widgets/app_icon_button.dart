import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_colors.dart';
import '../theme/app_radius.dart';

/// Icon button variant from DESIGN_SPEC §2.
enum AppIconButtonVariant {
  /// Surface + 1px border. Standard — used in app bars and content.
  surface,

  /// On violet/primary fill: white overlay background, no border.
  onPrimary,

  /// Transparent — ghost icon button (no background, no border).
  ghost,
}

/// Owezy icon button — 44×44, radius 14.
///
/// Design source: DESIGN_SPEC §2 Components — Icon button.
/// - 44×44 touch target (matches [AppSpacing.touchMin])
/// - Radius 14 ([AppRadius.md])
/// - Surface variant: `surface` fill + 1px `border`
/// - On-primary variant: `rgba(255,255,255,0.16)` fill, no border
///
/// Optionally shows a notification dot (8px `owe` circle, 2px surface ring).
///
/// ```dart
/// AppIconButton(icon: Icons.notifications_outlined, onPressed: () {})
/// AppIconButton(
///   icon: Icons.close,
///   variant: AppIconButtonVariant.onPrimary,
///   onPressed: () => Get.back(),
/// )
/// ```
class AppIconButton extends StatelessWidget {
  const AppIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.variant = AppIconButtonVariant.surface,
    this.iconSize = 20.0,
    this.size = 44.0,
    this.showDot = false,
    this.semanticLabel,
  });

  final IconData icon;
  final VoidCallback? onPressed;
  final AppIconButtonVariant variant;
  final double iconSize;
  final double size;
  final bool showDot;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final Color bg;
    final Color iconColor;
    final Border? border;

    switch (variant) {
      case AppIconButtonVariant.surface:
        bg = context.appSurface;
        iconColor = context.appText;
        border = Border.all(color: context.appBorder);
      case AppIconButtonVariant.onPrimary:
        bg = const Color(0x29FFFFFF); // rgba(255,255,255,0.16)
        iconColor = AppColorsLight.onPrimary; // white in both modes
        border = null;
      case AppIconButtonVariant.ghost:
        bg = Colors.transparent;
        iconColor = context.appText;
        border = null;
    }

    return Semantics(
      button: true,
      label: semanticLabel,
      child: GestureDetector(
        onTap: onPressed,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                color: bg,
                borderRadius: const BorderRadius.all(Radius.circular(AppRadius.md)),
                border: border,
              ),
              child: Icon(icon, size: iconSize, color: iconColor),
            ),
            if (showDot)
              Positioned(
                top: 10,
                right: 11,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: context.appOwe,
                    shape: BoxShape.circle,
                    border: Border.all(color: context.appSurface, width: 2),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
