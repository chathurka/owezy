import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_assets.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';

// Design source: Figma html.to.design — node 1:4557 (Welcome)
// Frame 390×844 · violet hero 462h · CTA stack pinned to bottom

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});

  /// Space reserved for headline + CTAs + legal so content never clips.
  static const double _bottomReserve = 292;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final bottomInset = MediaQuery.paddingOf(context).bottom;
    return Scaffold(
      backgroundColor: context.appBackground,
      body: LayoutBuilder(
        builder: (context, constraints) {
          final heroHeight = (constraints.maxHeight - _bottomReserve - bottomInset)
              .clamp(240.0, _WelcomeHero.designHeight);
          return Stack(
            children: [
              Column(
                children: [
                  _WelcomeHero(height: heroHeight),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(28, AppSpacing.s5, 28, 0),
                    child: Column(
                      children: [
                        Text(
                          l10n.welcomeHeadline,
                          textAlign: TextAlign.center,
                          style: AppTextStyles.amountLg.copyWith(
                            color: context.appText,
                            height: 34.5 / 30,
                            letterSpacing: -1,
                          ),
                        ),
                        const SizedBox(height: 7),
                        Text(
                          l10n.welcomeSubtitle,
                          textAlign: TextAlign.center,
                          style: AppTextStyles.body.copyWith(
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                            color: context.appTextMuted,
                            height: 21.75 / 15,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: Padding(
                  padding: EdgeInsets.fromLTRB(
                    AppSpacing.s6,
                    14,
                    AppSpacing.s6,
                    math.max(bottomInset, 20),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      AppButton(
                        label: l10n.welcomeCreateAccount,
                        onPressed: () => Get.toNamed(AppRoutes.register),
                      ),
                      const SizedBox(height: 10),
                      AppButton(
                        label: l10n.welcomeHaveAccount,
                        variant: AppButtonVariant.ghost,
                        onPressed: () => Get.toNamed(AppRoutes.login),
                      ),
                      const SizedBox(height: 6),
                      _LegalFooter(
                        prefix: l10n.welcomeLegalPrefix,
                        terms: l10n.welcomeLegalTerms,
                        conjunction: l10n.welcomeLegalConjunction,
                        privacy: l10n.welcomeLegalPrivacy,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _WelcomeHero extends StatelessWidget {
  const _WelcomeHero({required this.height});

  static const double designHeight = 462;
  static const double _heroBottomRadius = 44;

  final double height;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final scale = (height / designHeight).clamp(0.55, 1.0);
    final topPad = MediaQuery.paddingOf(context).top + (16 * scale);
    return SizedBox(
      height: height,
      width: double.infinity,
      child: ClipRRect(
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(_heroBottomRadius),
          bottomRight: Radius.circular(_heroBottomRadius),
        ),
        child: ColoredBox(
          color: context.appPrimary,
          child: Stack(
            clipBehavior: Clip.hardEdge,
            children: [
              Positioned(
                left: -35 * scale,
                top: -90 * scale,
                child: Transform.scale(
                  alignment: Alignment.topLeft,
                  scale: scale,
                  child: SvgPicture.asset(
                    AppAssets.welcomeHeroRings,
                    // Intrinsic 460×460 from Figma asset — do not override.
                  ),
                ),
              ),
              Positioned(
                top: topPad,
                left: 0,
                right: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Transform.scale(
                      scale: scale,
                      child: const _BrandMark(elevated: false),
                    ),
                    SizedBox(width: 10 * scale),
                    Text(
                      l10n.appName.toLowerCase(),
                      style: AppTextStyles.title.copyWith(
                        fontSize: 25 * scale,
                        color: context.appOnPrimary,
                        letterSpacing: -0.8,
                      ),
                    ),
                  ],
                ),
              ),
              Positioned(
                top: topPad + (54 * scale),
                left: 0,
                right: 0,
                child: Center(
                  child: Transform.scale(
                    scale: scale,
                    alignment: Alignment.topCenter,
                    child: SizedBox(
                      width: 300,
                      height: 258,
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          SvgPicture.asset(
                            AppAssets.welcomeOrbitRing,
                            // Intrinsic 300×258 from Figma asset — do not override.
                          ),
                          const Positioned(
                            left: 105,
                            top: 87,
                            child: _BrandMark(elevated: true),
                          ),
                          Positioned(
                            left: 96,
                            top: 6,
                            child: _AmountPill(label: l10n.welcomeHeroAmount),
                          ),
                          const Positioned(
                            left: 20,
                            top: 70,
                            child: _OrbitAvatar(
                              initials: 'MC',
                              background: AppColorsLight.avatarPinkBg,
                              foreground: AppColorsLight.avatarPinkFg,
                            ),
                          ),
                          const Positioned(
                            left: 234,
                            top: 70,
                            child: _OrbitAvatar(
                              initials: 'LP',
                              background: AppColorsLight.avatarSkyBg,
                              foreground: AppColorsLight.avatarSkyFg,
                            ),
                          ),
                          const Positioned(
                            left: 40,
                            top: 190,
                            child: _OrbitAvatar(
                              initials: 'DR',
                              background: AppColorsLight.avatarGreenBg,
                              foreground: AppColorsLight.avatarGreenFg,
                            ),
                          ),
                          const Positioned(
                            left: 214,
                            top: 190,
                            child: _OrbitAvatar(
                              initials: 'PN',
                              background: AppColorsLight.avatarPeachBg,
                              foreground: AppColorsLight.avatarPeachFg,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BrandMark extends StatelessWidget {
  const _BrandMark({required this.elevated});

  final bool elevated;

  @override
  Widget build(BuildContext context) {
    final size = elevated ? 90.0 : 40.0;
    final radius = elevated ? 30.0 : 13.0;
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: context.appOnPrimary,
        borderRadius: BorderRadius.all(Radius.circular(radius)),
        boxShadow: elevated
            ? const [
                BoxShadow(
                  color: Color(0x3814142B),
                  blurRadius: 18,
                  offset: Offset(0, 16),
                ),
              ]
            : null,
      ),
      alignment: Alignment.center,
      child: SvgPicture.asset(
        elevated ? AppAssets.welcomeGlyphLg : AppAssets.welcomeGlyphSm,
        // Intrinsic 46×46 / 24×24 from Figma — do not override.
      ),
    );
  }
}

class _OrbitAvatar extends StatelessWidget {
  const _OrbitAvatar({
    required this.initials,
    required this.background,
    required this.foreground,
  });

  final String initials;
  final Color background;
  final Color foreground;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 46,
      height: 46,
      decoration: BoxDecoration(
        color: background,
        shape: BoxShape.circle,
        border: Border.all(color: context.appPrimary, width: 2),
      ),
      alignment: Alignment.center,
      child: Text(
        initials,
        style: AppTextStyles.label.copyWith(
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: foreground,
          height: 1,
        ),
      ),
    );
  }
}

class _AmountPill extends StatelessWidget {
  const _AmountPill({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 34,
      padding: const EdgeInsets.symmetric(horizontal: 14),
      decoration: BoxDecoration(
        color: context.appOnPrimary,
        borderRadius: AppRadius.chip,
        boxShadow: const [
          BoxShadow(
            color: Color(0x2E14142B),
            blurRadius: 12,
            offset: Offset(0, 10),
          ),
        ],
      ),
      alignment: Alignment.center,
      child: Text(
        label,
        style: AppTextStyles.label.copyWith(
          fontSize: 14,
          fontWeight: FontWeight.w800,
          color: AppColorsLight.owed,
          height: 1,
        ),
      ),
    );
  }
}

class _LegalFooter extends StatelessWidget {
  const _LegalFooter({
    required this.prefix,
    required this.terms,
    required this.conjunction,
    required this.privacy,
  });

  final String prefix;
  final String terms;
  final String conjunction;
  final String privacy;

  @override
  Widget build(BuildContext context) {
    final muted = context.appTextMuted;
    final linkColor = context.appPrimaryText;
    final baseStyle = AppTextStyles.caption.copyWith(
      fontSize: 11,
      fontWeight: FontWeight.w500,
      color: muted,
      height: 1.5,
    );
    final linkStyle = baseStyle.copyWith(
      color: linkColor,
      fontWeight: FontWeight.w600,
      decoration: TextDecoration.underline,
      decorationColor: linkColor,
    );
    return Text.rich(
      TextSpan(
        style: baseStyle,
        children: [
          TextSpan(text: prefix),
          TextSpan(text: terms, style: linkStyle),
          TextSpan(text: conjunction),
          TextSpan(text: privacy, style: linkStyle),
        ],
      ),
      textAlign: TextAlign.center,
    );
  }
}
