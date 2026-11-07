/// Owezy spacing scale — sourced from packages/design-system/mobile/tokens.json.
/// Base is 4px. All values in logical pixels.
abstract final class AppSpacing {
  static const double s1 = 4.0;
  static const double s2 = 8.0;
  static const double s3 = 12.0;
  static const double s4 = 16.0;
  static const double s5 = 20.0;
  static const double s6 = 24.0;
  static const double s8 = 32.0;

  /// Standard page edge padding (matches --screen-padding 20px in CSS).
  static const double page = s5;

  /// Bottom navigation bar total height (including safe area padding).
  static const double navHeight = 88.0;

  /// Approximate status-bar + navigation safe area at the top.
  static const double safeTop = 56.0;

  /// Minimum touch target size per design spec.
  static const double touchMin = 44.0;
}
