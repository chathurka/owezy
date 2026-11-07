import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_radius.dart';

/// Card style variant from DESIGN_SPEC elevation rules.
enum AppCardStyle {
  /// Regular content card — surface fill + 1px border in light; surface step in dark.
  content,

  /// Raised card — surfaceRaised fill + border in light; surfaceRaised in dark.
  raised,

  /// Floating — with floatingCard shadow (allowed in both modes).
  floating,
}

/// Owezy content card — surface, border, radius 24.
///
/// Design source: DESIGN_SPEC §1 Elevation + §2 Components.
/// - Regular cards: `surface` + 1px `border`, radius 24 (content), 22 (group), 18 (list).
/// - Elevation policy: light uses borders + selective shadows; dark uses surface steps.
///
/// ```dart
/// AppCard(
///   child: Column(children: [...]),
/// )
/// AppCard(
///   style: AppCardStyle.floating,
///   padding: EdgeInsets.all(16),
///   child: Text('Stat'),
/// )
/// ```
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.style = AppCardStyle.content,
    this.padding = const EdgeInsets.all(20),
    this.radius,
    this.onTap,
  });

  final Widget child;
  final AppCardStyle style;
  final EdgeInsetsGeometry padding;

  /// Override radius — defaults to [AppRadius.contentCard] (24).
  final double? radius;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final double r = radius ?? AppRadius.r3xl; // 24
    final Color bg;
    final Border? border;
    final List<BoxShadow>? shadow;

    switch (style) {
      case AppCardStyle.content:
        bg = context.appSurface;
        border = context.isDark ? null : Border.all(color: context.appBorder);
        shadow = null;
      case AppCardStyle.raised:
        bg = context.appSurfaceRaised;
        border = context.isDark ? null : Border.all(color: context.appBorder);
        shadow = null;
      case AppCardStyle.floating:
        bg = context.appSurface;
        border = context.isDark ? null : Border.all(color: context.appBorder);
        shadow = const [
          BoxShadow(
            color: Color(0x1414142B),
            blurRadius: 30,
            offset: Offset(0, 12),
          ),
        ];
    }

    Widget card = Container(
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(r),
        border: border,
        boxShadow: shadow,
      ),
      padding: padding,
      child: child,
    );

    if (onTap != null) {
      card = GestureDetector(onTap: onTap, child: card);
    }
    return card;
  }
}
