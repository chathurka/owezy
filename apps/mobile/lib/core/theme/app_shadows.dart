import 'package:flutter/material.dart';

/// Owezy shadow tokens — mirrored from packages/design-system/mobile/tokens.json `shadow.*`.
///
/// Elevation policy (from DESIGN_SPEC §1):
///   Light mode — 1 px border on regular cards; shadows reserved for:
///     hero card, FAB, primary CTA, floating stat card, segment indicator.
///   Dark mode — suppress decorative shadows; use surface steps for depth.
///
/// Use the [*ForBrightness] helpers so widgets automatically respect the policy.
abstract final class AppShadows {
  // ── Token values ──────────────────────────────────────────────────────────

  /// Hero card drop shadow — violet glow. Light only.
  static const List<BoxShadow> hero = [
    BoxShadow(
      color: Color(0x47635BDB), // rgba(99,91,219,0.28)
      blurRadius: 40,
      offset: Offset(0, 18),
    ),
  ];

  /// FAB shadow — deeper violet glow. Light only.
  static const List<BoxShadow> fab = [
    BoxShadow(
      color: Color(0x66635BDB), // rgba(99,91,219,0.40)
      blurRadius: 24,
      offset: Offset(0, 10),
    ),
  ];

  /// Primary CTA button shadow. Light only.
  static const List<BoxShadow> primaryButton = [
    BoxShadow(
      color: Color(0x52635BDB), // rgba(99,91,219,0.32)
      blurRadius: 24,
      offset: Offset(0, 10),
    ),
  ];

  /// Floating stat card (Group details overlay). Allowed in both modes.
  static const List<BoxShadow> floatingCard = [
    BoxShadow(
      color: Color(0x1414142B), // rgba(20,20,43,0.08)
      blurRadius: 30,
      offset: Offset(0, 12),
    ),
  ];

  /// Segment selected indicator. Allowed in both modes.
  static const List<BoxShadow> segmentSelected = [
    BoxShadow(
      color: Color(0x1414142B), // rgba(20,20,43,0.08)
      blurRadius: 6,
      offset: Offset(0, 2),
    ),
  ];

  // ── Brightness-aware helpers ──────────────────────────────────────────────

  /// Returns [hero] in light mode; empty in dark mode.
  static List<BoxShadow> heroForBrightness(Brightness b) =>
      b == Brightness.dark ? const [] : hero;

  /// Returns [primaryButton] in light mode; empty in dark mode.
  static List<BoxShadow> primaryButtonForBrightness(Brightness b) =>
      b == Brightness.dark ? const [] : primaryButton;

  /// Returns [fab] in light mode; empty in dark mode.
  static List<BoxShadow> fabForBrightness(Brightness b) =>
      b == Brightness.dark ? const [] : fab;

  /// Focus ring rendered as a BoxShadow spread.
  /// Pass [primarySoft] resolved from the current theme.
  static BoxShadow focusRing(Color primarySoft) => BoxShadow(
        color: primarySoft,
        blurRadius: 0,
        spreadRadius: 4,
      );
}
