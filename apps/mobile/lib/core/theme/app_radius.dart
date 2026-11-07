import 'package:flutter/material.dart';

/// Owezy border-radius scale — sourced from packages/design-system/mobile/tokens.json.
/// Values are raw doubles (dp); named [BorderRadius] helpers are provided for
/// common use cases.
abstract final class AppRadius {
  // Raw values
  static const double xs   = 8.0;
  static const double sm   = 12.0;
  static const double md   = 14.0;
  static const double lg   = 16.0;
  static const double xl   = 18.0;
  static const double r2xl = 22.0;
  static const double r3xl = 24.0;
  static const double r4xl = 28.0;
  static const double pill = 999.0;

  // Named BorderRadius helpers
  /// Stepper buttons, chart bar tops, tooltips.
  static const BorderRadius chip = BorderRadius.all(Radius.circular(pill));

  /// Small tiles, compact buttons, date chips.
  static const BorderRadius button = BorderRadius.all(Radius.circular(lg));

  /// Inputs, large tiles, alerts.
  static const BorderRadius input = BorderRadius.all(Radius.circular(lg));

  /// List cards, hero inner tiles.
  static const BorderRadius card = BorderRadius.all(Radius.circular(xl));

  /// Content cards.
  static const BorderRadius contentCard = BorderRadius.all(Radius.circular(r3xl));

  /// Group cards.
  static const BorderRadius groupCard = BorderRadius.all(Radius.circular(r2xl));

  /// Hero card, modal sheet.
  static const BorderRadius modal = BorderRadius.all(Radius.circular(r4xl));

  /// Bottom sheet — rounded top only.
  static const BorderRadius bottomSheet = BorderRadius.only(
    topLeft:  Radius.circular(r4xl),
    topRight: Radius.circular(r4xl),
  );
}
