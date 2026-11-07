import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_colors_ext.dart';
import '../theme/app_text_styles.dart';

/// Predefined avatar colour palette from DESIGN_SPEC / tokens.
/// "you" is always violet — the current user is always identified by this colour.
enum AppAvatarPalette {
  you,
  pink,
  sky,
  amber,
  green,
  peach,
  violet,
}

/// Owezy avatar — circle with initials.
///
/// Design source: DESIGN_SPEC §2 — Avatar.
/// Sizes: 24 / 34 / 36 / 40 / 44 / 56 / 68.
/// Colours from [AppAvatarPalette]; "you" is always violet.
///
/// [AppAvatarStack] renders up to 4 overlapping avatars with −8dp offset
/// and a 2px surface ring (used in Group cards and Group details).
///
/// ```dart
/// AppAvatar(initials: 'MK', size: 44, palette: AppAvatarPalette.pink)
/// AppAvatar.you(size: 56)  // current user, always violet
/// ```
class AppAvatar extends StatelessWidget {
  const AppAvatar({
    super.key,
    required this.initials,
    required this.size,
    this.palette = AppAvatarPalette.you,
  });

  /// Convenience constructor for the current user (always violet).
  const AppAvatar.you({super.key, required this.size})
      : initials = 'Y',
        palette = AppAvatarPalette.you;

  final String initials;
  final double size;
  final AppAvatarPalette palette;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = _colors(context, palette);
    final fontSize = size * 0.36;

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
      alignment: Alignment.center,
      child: Text(
        initials.length > 2 ? initials.substring(0, 2).toUpperCase() : initials.toUpperCase(),
        style: AppTextStyles.label.copyWith(
          fontSize: fontSize.clamp(10.0, 22.0),
          fontWeight: FontWeight.w700,
          color: fg,
          height: 1,
        ),
      ),
    );
  }

  static (Color, Color) _colors(BuildContext context, AppAvatarPalette p) {
    final dark = context.isDark;
    return switch (p) {
      AppAvatarPalette.you =>
        (AppColorsLight.avatarYouBg, AppColorsLight.avatarYouFg), // same in both
      AppAvatarPalette.pink => dark
          ? (AppColorsDark.avatarPinkBg, AppColorsDark.avatarPinkFg)
          : (AppColorsLight.avatarPinkBg, AppColorsLight.avatarPinkFg),
      AppAvatarPalette.sky => dark
          ? (AppColorsDark.avatarSkyBg, AppColorsDark.avatarSkyFg)
          : (AppColorsLight.avatarSkyBg, AppColorsLight.avatarSkyFg),
      AppAvatarPalette.amber => dark
          ? (AppColorsDark.avatarAmberBg, AppColorsDark.avatarAmberFg)
          : (AppColorsLight.avatarAmberBg, AppColorsLight.avatarAmberFg),
      AppAvatarPalette.green => dark
          ? (AppColorsDark.avatarGreenBg, AppColorsDark.avatarGreenFg)
          : (AppColorsLight.avatarGreenBg, AppColorsLight.avatarGreenFg),
      AppAvatarPalette.peach => dark
          ? (AppColorsDark.avatarPeachBg, AppColorsDark.avatarPeachFg)
          : (AppColorsLight.avatarPeachBg, AppColorsLight.avatarPeachFg),
      AppAvatarPalette.violet => dark
          ? (AppColorsDark.avatarVioletBg, AppColorsDark.avatarVioletFg)
          : (AppColorsLight.avatarVioletBg, AppColorsLight.avatarVioletFg),
    };
  }
}

/// Overlapping avatar stack — up to 4, −8dp offset, 2px surface ring.
///
/// Design source: DESIGN_SPEC §2 — Group card, Expense row.
class AppAvatarStack extends StatelessWidget {
  const AppAvatarStack({
    super.key,
    required this.avatars,
    this.size = 24.0,
    this.overlap = 8.0,
    this.maxVisible = 4,
  });

  final List<AppAvatar> avatars;
  final double size;
  final double overlap;
  final int maxVisible;

  @override
  Widget build(BuildContext context) {
    final visible = avatars.take(maxVisible).toList();
    final extra = avatars.length - maxVisible;
    final ringColor = context.appSurface;

    return SizedBox(
      height: size,
      width: size + (visible.length - 1) * (size - overlap),
      child: Stack(
        children: [
          for (var i = 0; i < visible.length; i++)
            Positioned(
              left: i * (size - overlap),
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: ringColor, width: 2),
                ),
                child: visible[i],
              ),
            ),
          if (extra > 0)
            Positioned(
              left: visible.length * (size - overlap),
              child: Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  color: context.appSubtle,
                  shape: BoxShape.circle,
                  border: Border.all(color: ringColor, width: 2),
                ),
                alignment: Alignment.center,
                child: Text(
                  '+$extra',
                  style: AppTextStyles.micro.copyWith(
                    color: context.appTextMuted,
                    height: 1,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
