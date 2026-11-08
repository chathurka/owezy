import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';

import '../../../../core/theme/app_assets.dart';
import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';

/// Shared auth chrome — Figma Owezy Mobile Sign in / Create account / Verify email.
///
/// Design: https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile
/// Nodes: Sign in `1:4675`, Create account `1:4605`, Verify email `1:4743`.

class AuthBackButton extends StatelessWidget {
  const AuthBackButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed ?? () => Get.back<void>(),
      child: Container(
        width: AppSpacing.touchMin,
        height: AppSpacing.touchMin,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: context.appSubtle,
          borderRadius: const BorderRadius.all(Radius.circular(AppRadius.md)),
        ),
        child: SvgPicture.asset(
          AppAssets.iconChevronLeft,
          // Intrinsic 22×22 from Figma — do not override.
          colorFilter: ColorFilter.mode(context.appText, BlendMode.srcIn),
        ),
      ),
    );
  }
}

class AuthBrandMark extends StatelessWidget {
  const AuthBrandMark({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: AppDimensions.size48,
      height: AppDimensions.size48,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: context.appPrimary,
        borderRadius: const BorderRadius.all(Radius.circular(AppRadius.md)),
      ),
      child: SvgPicture.asset(
        AppAssets.logoMark,
        // Intrinsic 28×28 from Figma — do not override.
      ),
    );
  }
}

class AuthSocialButton extends StatelessWidget {
  const AuthSocialButton({
    super.key,
    required this.label,
    required this.isApple,
    this.onPressed,
  });

  final String label;
  final bool isApple;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: AppDimensions.size52,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: context.appSurface,
          disabledForegroundColor: context.appText,
          foregroundColor: context.appText,
          side: BorderSide(color: context.appBorderStrong),
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(AppRadius.lg)),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _SocialBadge(isApple: isApple),
            const SizedBox(width: AppDimensions.size10),
            Text(
              label,
              style: AppTextStyles.bodyStrong.copyWith(color: context.appText),
            ),
          ],
        ),
      ),
    );
  }
}

class _SocialBadge extends StatelessWidget {
  const _SocialBadge({required this.isApple});

  final bool isApple;

  @override
  Widget build(BuildContext context) {
    if (isApple) {
      return Container(
        width: AppDimensions.size22,
        height: AppDimensions.size22,
        decoration: BoxDecoration(
          color: context.appText,
          borderRadius: const BorderRadius.all(Radius.circular(AppDimensions.size7)),
        ),
      );
    }
    return Container(
      width: AppDimensions.size22,
      height: AppDimensions.size22,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: context.appSurface,
        borderRadius: const BorderRadius.all(Radius.circular(11)),
        border: Border.all(
          color: context.appBorderStrong,
          width: AppDimensions.size1_5,
        ),
      ),
      child: Text(
        'G',
        style: AppTextStyles.label.copyWith(
          fontWeight: FontWeight.w800,
          color: context.appTextMuted,
          fontSize: 13,
        ),
      ),
    );
  }
}

class AuthOrDivider extends StatelessWidget {
  const AuthOrDivider({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Divider(color: context.appBorder, thickness: 1)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            label,
            style: AppTextStyles.caption.copyWith(
              fontWeight: FontWeight.w600,
              color: context.appTextMuted,
            ),
          ),
        ),
        Expanded(child: Divider(color: context.appBorder, thickness: 1)),
      ],
    );
  }
}

class AuthStickyFooter extends StatelessWidget {
  const AuthStickyFooter({
    super.key,
    required this.prompt,
    required this.actionLabel,
    required this.onAction,
  });

  final String prompt;
  final String actionLabel;
  final VoidCallback onAction;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.s6,
        AppSpacing.s4,
        AppSpacing.s6,
        30,
      ),
      color: context.appSurface,
      child: Text.rich(
        TextSpan(
          text: '$prompt ',
          style: AppTextStyles.body.copyWith(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: context.appTextMuted,
          ),
          children: [
            WidgetSpan(
              alignment: PlaceholderAlignment.baseline,
              baseline: TextBaseline.alphabetic,
              child: GestureDetector(
                onTap: onAction,
                child: Text(
                  actionLabel,
                  style: AppTextStyles.bodyStrong.copyWith(
                    fontSize: 14,
                    color: context.appPrimary,
                    decoration: TextDecoration.underline,
                    decorationColor: context.appPrimary,
                  ),
                ),
              ),
            ),
          ],
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}
