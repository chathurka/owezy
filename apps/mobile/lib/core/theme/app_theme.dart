import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'app_radius.dart';
import 'app_text_styles.dart';

/// Owezy [ThemeData] composition — light and dark.
/// Tokens come from [AppColorsLight], [AppColorsDark], [AppTextStyles],
/// and [AppRadius]. Never duplicate colour literals here.
///
/// Typography uses the bundled Inter family (see pubspec `fonts:`) so
/// ExtraBold / SemiBold match Figma Design system · v1.1 exactly.
abstract final class AppTheme {
  // ── Light ───────────────────────────────────────────────────────────────────

  static ThemeData get light {
    final base = _buildTheme(
      brightness: Brightness.light,
      colors: _LightScheme(),
    );
    return base;
  }

  // ── Dark ────────────────────────────────────────────────────────────────────

  static ThemeData get dark {
    final base = _buildTheme(
      brightness: Brightness.dark,
      colors: _DarkScheme(),
    );
    return base;
  }

  // ── Shared builder ──────────────────────────────────────────────────────────

  static ThemeData _buildTheme({
    required Brightness brightness,
    required _AppColorScheme colors,
  }) {
    final textTheme = TextTheme(
      displayLarge: AppTextStyles.display.copyWith(color: colors.text),
      displayMedium: AppTextStyles.amountLg.copyWith(color: colors.text),
      displaySmall: AppTextStyles.amount.copyWith(color: colors.text),
      headlineLarge: AppTextStyles.title.copyWith(color: colors.text),
      headlineMedium: AppTextStyles.title.copyWith(color: colors.text),
      headlineSmall: AppTextStyles.headline.copyWith(color: colors.text),
      titleLarge: AppTextStyles.headline.copyWith(color: colors.text),
      titleMedium: AppTextStyles.bodyStrong.copyWith(color: colors.text),
      titleSmall: AppTextStyles.label.copyWith(color: colors.text),
      bodyLarge: AppTextStyles.body.copyWith(color: colors.text),
      bodyMedium: AppTextStyles.body.copyWith(color: colors.text),
      bodySmall: AppTextStyles.caption.copyWith(color: colors.textMuted),
      labelLarge: AppTextStyles.bodyStrong.copyWith(color: colors.text),
      labelMedium: AppTextStyles.label.copyWith(color: colors.text),
      labelSmall: AppTextStyles.micro.copyWith(color: colors.textMuted),
    );

    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: colors.primary,
      onPrimary: colors.onPrimary,
      primaryContainer: colors.primarySoft,
      onPrimaryContainer: colors.primaryText,
      secondary: colors.primaryText,
      onSecondary: colors.onPrimary,
      secondaryContainer: colors.primarySoft,
      onSecondaryContainer: colors.primaryText,
      error: colors.danger,
      onError: colors.onPrimary,
      surface: colors.surface,
      onSurface: colors.text,
      surfaceContainerHighest: colors.surfaceRaised,
      onSurfaceVariant: colors.textMuted,
      outline: colors.border,
      outlineVariant: colors.borderStrong,
      scrim: colors.scrim,
      inverseSurface: colors.inverse,
      onInverseSurface: colors.onInverse,
      inversePrimary: colors.primaryText,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      fontFamily: AppTextStyles.fontFamily,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colors.background,
      textTheme: textTheme,

      // AppBar
      appBarTheme: AppBarTheme(
        backgroundColor: colors.surface,
        foregroundColor: colors.text,
        surfaceTintColor: Colors.transparent,
        shadowColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: AppTextStyles.navTitle.copyWith(color: colors.text),
      ),

      // Input
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide: BorderSide(color: colors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide: BorderSide(color: colors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide: BorderSide(color: colors.primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide: BorderSide(color: colors.danger),
        ),
        filled: true,
        fillColor: colors.surface,
        hintStyle: AppTextStyles.body.copyWith(color: colors.textMuted),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),

      // Elevated Button (primary CTA)
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: colors.primary,
          foregroundColor: colors.onPrimary,
          disabledBackgroundColor: colors.border,
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.button),
          minimumSize: const Size.fromHeight(56),
          textStyle: AppTextStyles.bodyStrong,
          elevation: 0,
        ),
      ),

      // Outlined Button (secondary)
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: colors.primaryText,
          backgroundColor: colors.primarySoft,
          side: BorderSide.none,
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.button),
          minimumSize: const Size.fromHeight(56),
          textStyle: AppTextStyles.bodyStrong,
        ),
      ),

      // Text Button (ghost)
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: colors.primaryText,
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.button),
          minimumSize: const Size(44, 44),
          textStyle: AppTextStyles.label,
        ),
      ),

      // Card
      cardTheme: CardThemeData(
        color: colors.surface,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.card,
          side: BorderSide(color: colors.border),
        ),
        margin: EdgeInsets.zero,
      ),

      // Chip
      chipTheme: ChipThemeData(
        backgroundColor: colors.primarySoft,
        selectedColor: colors.inverse,
        labelStyle: AppTextStyles.label.copyWith(color: colors.primaryText),
        side: BorderSide.none,
        shape: const StadiumBorder(),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      ),

      // Divider
      dividerTheme: DividerThemeData(
        color: colors.divider,
        thickness: 1,
        space: 1,
      ),

      // Bottom Navigation
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: colors.surface,
        selectedItemColor: colors.primary,
        unselectedItemColor: colors.textMuted,
        showSelectedLabels: true,
        showUnselectedLabels: true,
        elevation: 0,
        type: BottomNavigationBarType.fixed,
        selectedLabelStyle: AppTextStyles.micro,
        unselectedLabelStyle: AppTextStyles.micro,
      ),

      // Switch
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return colors.onPrimary;
          return colors.textMuted;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return colors.primary;
          return colors.borderStrong;
        }),
        trackOutlineColor: WidgetStateProperty.all(Colors.transparent),
      ),

      // SnackBar
      snackBarTheme: SnackBarThemeData(
        backgroundColor: colors.inverse,
        contentTextStyle: AppTextStyles.body.copyWith(color: colors.onInverse),
        behavior: SnackBarBehavior.floating,
        shape: const RoundedRectangleBorder(borderRadius: AppRadius.card),
      ),

      // BottomSheet
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: colors.surface,
        surfaceTintColor: Colors.transparent,
        shape: const RoundedRectangleBorder(borderRadius: AppRadius.bottomSheet),
        elevation: 0,
      ),

      // Dialog
      dialogTheme: DialogThemeData(
        backgroundColor: colors.surface,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        shape: const RoundedRectangleBorder(borderRadius: AppRadius.modal),
        titleTextStyle: AppTextStyles.headline.copyWith(color: colors.text),
        contentTextStyle: AppTextStyles.body.copyWith(color: colors.textMuted),
      ),

      // Progress Indicator
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: colors.primary,
        linearTrackColor: colors.track,
        circularTrackColor: colors.track,
      ),

      // List Tile
      listTileTheme: ListTileThemeData(
        tileColor: Colors.transparent,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
        titleTextStyle: AppTextStyles.bodyStrong.copyWith(color: colors.text),
        subtitleTextStyle: AppTextStyles.caption.copyWith(color: colors.textMuted),
      ),
    );
  }
}

// ── Internal colour-scheme abstractions ───────────────────────────────────────

abstract class _AppColorScheme {
  Color get background;
  Color get surface;
  Color get surfaceRaised;
  Color get border;
  Color get borderStrong;
  Color get divider;
  Color get track;
  Color get text;
  Color get textMuted;
  Color get primary;
  Color get primarySoft;
  Color get primaryText;
  Color get onPrimary;
  Color get danger;
  Color get inverse;
  Color get onInverse;
  Color get scrim;
}

class _LightScheme implements _AppColorScheme {
  @override Color get background    => AppColorsLight.background;
  @override Color get surface       => AppColorsLight.surface;
  @override Color get surfaceRaised => AppColorsLight.surfaceRaised;
  @override Color get border        => AppColorsLight.border;
  @override Color get borderStrong  => AppColorsLight.borderStrong;
  @override Color get divider       => AppColorsLight.divider;
  @override Color get track         => AppColorsLight.track;
  @override Color get text          => AppColorsLight.text;
  @override Color get textMuted     => AppColorsLight.textMuted;
  @override Color get primary       => AppColorsLight.primary;
  @override Color get primarySoft   => AppColorsLight.primarySoft;
  @override Color get primaryText   => AppColorsLight.primaryText;
  @override Color get onPrimary     => AppColorsLight.onPrimary;
  @override Color get danger        => AppColorsLight.danger;
  @override Color get inverse       => AppColorsLight.inverse;
  @override Color get onInverse     => AppColorsLight.onInverse;
  @override Color get scrim         => const Color(0x33141423);
}

class _DarkScheme implements _AppColorScheme {
  @override Color get background    => AppColorsDark.background;
  @override Color get surface       => AppColorsDark.surface;
  @override Color get surfaceRaised => AppColorsDark.surfaceRaised;
  @override Color get border        => AppColorsDark.border;
  @override Color get borderStrong  => AppColorsDark.borderStrong;
  @override Color get divider       => AppColorsDark.divider;
  @override Color get track         => AppColorsDark.track;
  @override Color get text          => AppColorsDark.text;
  @override Color get textMuted     => AppColorsDark.textMuted;
  @override Color get primary       => AppColorsDark.primary;
  @override Color get primarySoft   => AppColorsDark.primarySoft;
  @override Color get primaryText   => AppColorsDark.primaryText;
  @override Color get onPrimary     => AppColorsDark.onPrimary;
  @override Color get danger        => AppColorsDark.danger;
  @override Color get inverse       => AppColorsDark.inverse;
  @override Color get onInverse     => AppColorsDark.onInverse;
  @override Color get scrim         => const Color(0xB3050508);
}
