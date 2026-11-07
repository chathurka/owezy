import 'package:flutter/material.dart';

/// Owezy colour tokens — sourced from packages/design-system/mobile/tokens.json.
/// Light and dark palettes are separate classes; AppTheme wires them into
/// [ThemeData.colorScheme]. Never use hex literals anywhere else in the app.
///
/// Rule: money colours are NEVER used alone. Always pair:
///   • [AppColorsLight.owed] / [AppColorsDark.owed] with a "+" sign or "owed to you" label
///   • [AppColorsLight.owe]  / [AppColorsDark.owe]  with a "−" sign or "you owe" label

// ── Light palette ─────────────────────────────────────────────────────────────

abstract final class AppColorsLight {
  // Surfaces
  static const Color background    = Color(0xFFF7F7FB);
  static const Color surface       = Color(0xFFFFFFFF);
  static const Color surfaceRaised = Color(0xFFFFFFFF);
  static const Color subtle        = Color(0xFFF4F3FA);
  static const Color track         = Color(0xFFEEEDF6);
  static const Color border        = Color(0xFFECECF3);
  static const Color borderStrong  = Color(0xFFE4E3EE);
  static const Color divider       = Color(0xFFF0EFF5);

  // Text
  static const Color text          = Color(0xFF14142B);
  static const Color textSecondary = Color(0xFF4B4B66);
  static const Color textMuted     = Color(0xFF6E6E87);

  // Brand
  static const Color primary       = Color(0xFF635BDB);
  static const Color primaryPressed= Color(0xFF4B43C4);
  static const Color primaryText   = Color(0xFF635BDB);
  static const Color accentText    = Color(0xFF4B43C4);
  static const Color primarySoft   = Color(0xFFEFEEFC);
  static const Color onPrimary     = Color(0xFFFFFFFF);

  // Money — always pair with a sign or label
  static const Color owed          = Color(0xFF0E8A5F);
  static const Color owedSoft      = Color(0xFFE6F6EF);
  static const Color owe           = Color(0xFFC2410C);
  static const Color oweSoft       = Color(0xFFFFF1E6);
  static const Color danger        = Color(0xFFB42318);
  static const Color warningText   = Color(0xFF8A2E06);

  // Inverse
  static const Color inverse       = Color(0xFF14142B);
  static const Color onInverse     = Color(0xFFFFFFFF);

  // Charts
  static const Color chartPositive = Color(0xFF2FB57A);
  static const Color chartNegative = Color(0xFFF08A4B);
  static const Color chartBarMuted = Color(0xFFD9D6F8);
  static const List<Color> chartSeries = [
    Color(0xFF635BDB),
    Color(0xFF7FC8EC),
    Color(0xFFF2A541),
    Color(0xFF2FB57A),
    Color(0xFFE05B9B),
  ];

  // Category tiles
  static const Color catFoodBg          = Color(0xFFFFF1E6);
  static const Color catFoodFg          = Color(0xFFC2410C);
  static const Color catBillsBg         = Color(0xFFFEF7D6);
  static const Color catBillsFg         = Color(0xFF8A6100);
  static const Color catTravelBg        = Color(0xFFE8F3FE);
  static const Color catTravelFg        = Color(0xFF0B6A9E);
  static const Color catSettlementBg    = Color(0xFFE6F6EF);
  static const Color catSettlementFg    = Color(0xFF0E8A5F);
  static const Color catGroceriesBg     = Color(0xFFF1EEFE);
  static const Color catGroceriesFg     = Color(0xFF635BDB);
  static const Color catEntertainmentBg = Color(0xFFFCE7F1);
  static const Color catEntertainmentFg = Color(0xFFA3245F);

  // Avatars
  static const Color avatarYouBg    = Color(0xFF635BDB);
  static const Color avatarYouFg    = Color(0xFFFFFFFF);
  static const Color avatarPinkBg   = Color(0xFFFCE7F1);
  static const Color avatarPinkFg   = Color(0xFFA3245F);
  static const Color avatarSkyBg    = Color(0xFFE0F2FE);
  static const Color avatarSkyFg    = Color(0xFF0B6A9E);
  static const Color avatarAmberBg  = Color(0xFFFEF3C7);
  static const Color avatarAmberFg  = Color(0xFF8A5A00);
  static const Color avatarGreenBg  = Color(0xFFDCFCE7);
  static const Color avatarGreenFg  = Color(0xFF166A3D);
  static const Color avatarPeachBg  = Color(0xFFFFE4D6);
  static const Color avatarPeachFg  = Color(0xFFA3410F);
  static const Color avatarVioletBg = Color(0xFFE8E6FB);
  static const Color avatarVioletFg = Color(0xFF4B43C4);
}

// ── Dark palette ──────────────────────────────────────────────────────────────

abstract final class AppColorsDark {
  // Surfaces (depth comes from steps, not shadows)
  static const Color background    = Color(0xFF0E0D1A);
  static const Color surface       = Color(0xFF1A1930);
  static const Color surfaceRaised = Color(0xFF2D2B4D);
  static const Color subtle        = Color(0xFF24233D);
  static const Color track         = Color(0xFF22213A);
  static const Color border        = Color(0xFF2A2944);
  static const Color borderStrong  = Color(0xFF34334F);
  static const Color divider       = Color(0xFF26253E);

  // Text
  static const Color text          = Color(0xFFF2F1FA);
  static const Color textSecondary = Color(0xFFC9C8DE);
  static const Color textMuted     = Color(0xFFA3A2BD);

  // Brand (violet fill stays the same; text lightens for contrast)
  static const Color primary       = Color(0xFF635BDB);
  static const Color primaryPressed= Color(0xFF4B43C4);
  static const Color primaryText   = Color(0xFF9C96FF);
  static const Color accentText    = Color(0xFFA9A4FF);
  static const Color primarySoft   = Color(0xFF2A2752);
  static const Color onPrimary     = Color(0xFFFFFFFF);

  // Money — always pair with a sign or label
  static const Color owed          = Color(0xFF4CD592);
  static const Color owedSoft      = Color(0xFF12321F);
  static const Color owe           = Color(0xFFFF9A5C);
  static const Color oweSoft       = Color(0xFF3A2416);
  static const Color danger        = Color(0xFFFF8A80);
  static const Color warningText   = Color(0xFFFFC9A8);

  // Inverse
  static const Color inverse       = Color(0xFF2A2650);
  static const Color onInverse     = Color(0xFFF2F1FA);

  // Charts
  static const Color chartPositive = Color(0xFF2FB57A);
  static const Color chartNegative = Color(0xFFF08A4B);
  static const Color chartBarMuted = Color(0xFF3A3670);
  static const List<Color> chartSeries = [
    Color(0xFF635BDB),
    Color(0xFF7FC8EC),
    Color(0xFFF2A541),
    Color(0xFF2FB57A),
    Color(0xFFE05B9B),
  ];

  // Category tiles
  static const Color catFoodBg          = Color(0xFF3A2416);
  static const Color catFoodFg          = Color(0xFFFF9A5C);
  static const Color catBillsBg         = Color(0xFF352C10);
  static const Color catBillsFg         = Color(0xFFEBC75A);
  static const Color catTravelBg        = Color(0xFF13304A);
  static const Color catTravelFg        = Color(0xFF8DCBF5);
  static const Color catSettlementBg    = Color(0xFF12321F);
  static const Color catSettlementFg    = Color(0xFF4CD592);
  static const Color catGroceriesBg     = Color(0xFF26244A);
  static const Color catGroceriesFg     = Color(0xFF9C96FF);
  static const Color catEntertainmentBg = Color(0xFF3D1E30);
  static const Color catEntertainmentFg = Color(0xFFF5A3CB);

  // Avatars
  static const Color avatarYouBg    = Color(0xFF635BDB);
  static const Color avatarYouFg    = Color(0xFFFFFFFF);
  static const Color avatarPinkBg   = Color(0xFF3D1E30);
  static const Color avatarPinkFg   = Color(0xFFF5A3CB);
  static const Color avatarSkyBg    = Color(0xFF13304A);
  static const Color avatarSkyFg    = Color(0xFF8DCBF5);
  static const Color avatarAmberBg  = Color(0xFF3A2E10);
  static const Color avatarAmberFg  = Color(0xFFF2CF73);
  static const Color avatarGreenBg  = Color(0xFF143826);
  static const Color avatarGreenFg  = Color(0xFF7FDCA6);
  static const Color avatarPeachBg  = Color(0xFF3D2418);
  static const Color avatarPeachFg  = Color(0xFFFFB48A);
  static const Color avatarVioletBg = Color(0xFF26244A);
  static const Color avatarVioletFg = Color(0xFFA9A4FF);
}

// ── Shared / theme-invariant colours ─────────────────────────────────────────

abstract final class AppColors {
  /// Brand primary — same in light and dark.
  static const Color primary = Color(0xFF635BDB);

  /// Convenience aliases pointing at the light set.
  /// Prefer resolving theme-aware colours via AppTheme or BuildContext extension.
  static const Color textPrimary   = AppColorsLight.text;
  static const Color textSecondary = AppColorsLight.textSecondary;
  static const Color textDisabled  = AppColorsLight.textMuted;
  static const Color textInverse   = AppColorsLight.onPrimary;
  static const Color surface       = AppColorsLight.surface;
  static const Color background    = AppColorsLight.background;
  static const Color error         = AppColorsLight.danger;

  static const Color positive      = AppColorsLight.owed;
  static const Color positiveLight = AppColorsLight.owedSoft;
  static const Color warning       = AppColorsLight.owe;
  static const Color warningLight  = AppColorsLight.oweSoft;
  static const Color negative      = AppColorsLight.danger;
  static const Color negativeLight = Color(0xFFFCF0EE);
}
