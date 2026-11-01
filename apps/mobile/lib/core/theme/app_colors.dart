import 'package:flutter/material.dart';

/// Owezy color tokens.
/// Replace hex values with final brand palette from design team.
/// Mirror the token names defined in packages/design-system/tokens.css.
abstract final class AppColors {
  // Brand
  static const primary = Color(0xFF1A6EF0);
  static const primaryLight = Color(0xFFE8F1FE);
  static const primaryPressed = Color(0xFF1358C4);

  // Neutrals
  static const ink900 = Color(0xFF0F1F3B);
  static const ink700 = Color(0xFF374B6C);
  static const ink500 = Color(0xFF5A6E8C);
  static const ink300 = Color(0xFF93A3BC);

  // Surfaces
  static const surface = Color(0xFFFFFFFF);
  static const background = Color(0xFFF7FAFE);
  static const line = Color(0xFFE2EBF7);

  // Semantic
  static const positive = Color(0xFF1F7A52);
  static const positiveLight = Color(0xFFE4F4EC);
  static const warning = Color(0xFF8A5A12);
  static const warningLight = Color(0xFFFCEFDD);
  static const negative = Color(0xFFB4402F);
  static const negativeLight = Color(0xFFFCF0EE);

  // Text
  static const textPrimary = ink900;
  static const textSecondary = ink500;
  static const textDisabled = ink300;
  static const textInverse = Color(0xFFFFFFFF);

  // Error alias
  static const error = negative;
}
