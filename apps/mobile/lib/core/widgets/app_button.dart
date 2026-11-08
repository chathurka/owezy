import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_radius.dart';
import '../theme/app_shadows.dart';
import '../theme/app_text_styles.dart';

/// Button variant — maps to primary CTA, secondary, and ghost/text styles
/// from DESIGN_SPEC §2 Components.
enum AppButtonVariant { primary, secondary, ghost }

/// Button height variant per DESIGN_SPEC.
enum AppButtonSize {
  /// Standard CTA — 56 h, radius 18.
  standard,

  /// Compact — 52 h, radius 16 (used in split bars / social buttons).
  compact,

  /// Small — 44 h, radius 16 (minimum touch target).
  small,
}

/// Owezy branded button.
///
/// Wraps Flutter's Material buttons with Owezy token values and elevation
/// policy (shadow in light / suppressed in dark).
///
/// ```dart
/// AppButton(label: 'Create account', onPressed: () {})
/// AppButton(
///   label: 'Sign in with Apple',
///   variant: AppButtonVariant.secondary,
///   size: AppButtonSize.compact,
///   leadingIcon: SvgPicture.asset(AppAssets.iconApple, width: 18),
///   onPressed: null, // disabled
/// )
/// ```
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.standard,
    this.leadingIcon,
    this.isLoading = false,
    this.width = double.infinity,
  });

  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final Widget? leadingIcon;
  final bool isLoading;

  /// Pass a finite width; defaults to full-width.
  final double width;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final double height = switch (size) {
      AppButtonSize.standard => 56.0,
      AppButtonSize.compact  => 52.0,
      AppButtonSize.small    => 44.0,
    };
    final double radius = switch (size) {
      AppButtonSize.standard => AppRadius.xl,   // 18
      AppButtonSize.compact  => AppRadius.lg,   // 16
      AppButtonSize.small    => AppRadius.lg,   // 16
    };
    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(radius)),
    );
    final size_ = Size(width, height);
    final labelColor = switch (variant) {
      AppButtonVariant.primary => context.appOnPrimary,
      AppButtonVariant.secondary => context.appPrimaryText,
      AppButtonVariant.ghost => context.appText,
    };
    final labelWidget = isLoading
        ? SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: labelColor,
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (leadingIcon != null) ...[leadingIcon!, const SizedBox(width: 8)],
              Text(
                label,
                style: AppTextStyles.bodyStrong.copyWith(
                  inherit: false,
                  color: labelColor,
                ),
              ),
            ],
          );

    return switch (variant) {
      AppButtonVariant.primary => _PrimaryButton(
          shape: shape,
          size: size_,
          onPressed: isLoading ? null : onPressed,
          brightness: brightness,
          label: labelWidget,
          primaryColor: context.appPrimary,
          onPrimaryColor: context.appOnPrimary,
        ),
      AppButtonVariant.secondary => _SecondaryButton(
          shape: shape,
          size: size_,
          onPressed: isLoading ? null : onPressed,
          label: labelWidget,
          primarySoft: context.appPrimarySoft,
          primaryText: context.appPrimaryText,
        ),
      AppButtonVariant.ghost => _GhostButton(
          shape: shape,
          size: size_,
          onPressed: isLoading ? null : onPressed,
          label: labelWidget,
          surface: context.appSurface,
          borderColor: context.appBorderStrong,
          textColor: context.appText,
        ),
    };
  }
}

// ── Internal variants ─────────────────────────────────────────────────────────

class _PrimaryButton extends StatelessWidget {
  const _PrimaryButton({
    required this.shape,
    required this.size,
    required this.onPressed,
    required this.brightness,
    required this.label,
    required this.primaryColor,
    required this.onPrimaryColor,
  });

  final RoundedRectangleBorder shape;
  final Size size;
  final VoidCallback? onPressed;
  final Brightness brightness;
  final Widget label;
  final Color primaryColor;
  final Color onPrimaryColor;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: shape.borderRadius as BorderRadius,
        boxShadow: AppShadows.primaryButtonForBrightness(brightness),
      ),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: onPrimaryColor,
          disabledBackgroundColor: primaryColor.withValues(alpha: 0.5),
          disabledForegroundColor: onPrimaryColor.withValues(alpha: 0.6),
          shape: shape,
          minimumSize: size,
          elevation: 0,
          shadowColor: Colors.transparent,
          textStyle: AppTextStyles.bodyStrong.copyWith(color: onPrimaryColor),
        ),
        child: label,
      ),
    );
  }
}

class _SecondaryButton extends StatelessWidget {
  const _SecondaryButton({
    required this.shape,
    required this.size,
    required this.onPressed,
    required this.label,
    required this.primarySoft,
    required this.primaryText,
  });

  final RoundedRectangleBorder shape;
  final Size size;
  final VoidCallback? onPressed;
  final Widget label;
  final Color primarySoft;
  final Color primaryText;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        backgroundColor: primarySoft,
        foregroundColor: primaryText,
        disabledForegroundColor: primaryText.withValues(alpha: 0.5),
        side: BorderSide.none,
        shape: shape,
        minimumSize: size,
        textStyle: AppTextStyles.bodyStrong.copyWith(color: primaryText),
      ),
      child: label,
    );
  }
}

class _GhostButton extends StatelessWidget {
  const _GhostButton({
    required this.shape,
    required this.size,
    required this.onPressed,
    required this.label,
    required this.surface,
    required this.borderColor,
    required this.textColor,
  });

  final RoundedRectangleBorder shape;
  final Size size;
  final VoidCallback? onPressed;
  final Widget label;
  final Color surface;
  final Color borderColor;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        backgroundColor: surface,
        foregroundColor: textColor,
        disabledForegroundColor: textColor.withValues(alpha: 0.4),
        side: BorderSide(color: borderColor),
        shape: shape,
        minimumSize: size,
        textStyle: AppTextStyles.bodyStrong.copyWith(color: textColor),
      ),
      child: label,
    );
  }
}
