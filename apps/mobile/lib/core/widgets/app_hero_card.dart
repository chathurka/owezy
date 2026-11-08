import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_colors_ext.dart';
import '../theme/app_dimensions.dart';
import '../theme/app_radius.dart';
import '../theme/app_shadows.dart';
import '../theme/app_text_styles.dart';
import 'app_amount.dart';

/// Owezy hero card — primary fill, radius 28, padding 22, shadow.hero (light only).
///
/// Design source: DESIGN_SPEC §2 — Hero card.
/// - `primary` fill + `shadow.hero` in light; surface step in dark.
/// - Decorative rings SVG at right −70 / top −80 (optional [decoration] child).
/// - Two inner tiles `rgba(255,255,255,0.14)` radius 18, padding 12/14.
///
/// ```dart
/// AppHeroCard(
///   netAmount: '+\$842.50',
///   owedAmount: '\$1,057.50',
///   oweAmount: '\$215.00',
/// )
/// ```
class AppHeroCard extends StatelessWidget {
  const AppHeroCard({
    super.key,
    required this.netAmount,
    required this.owedAmount,
    required this.oweAmount,
    this.netSign = AmountSign.positive,
    this.netLabel,
    this.decoration,
  });

  /// The large net balance displayed in the hero (e.g. '+$842.50').
  final String netAmount;
  final AmountSign netSign;

  /// Optional label for the net amount (defaults to no label — sign prefix used).
  final String? netLabel;

  /// "Owed to you" sub-amount.
  final String owedAmount;

  /// "You owe" sub-amount.
  final String oweAmount;

  /// Optional decorative overlay (e.g., hero-rings SVG).
  final Widget? decoration;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    // In dark mode, suppress shadow and use elevated surface.
    final Color bg = brightness == Brightness.dark
        ? context.appSurfaceRaised
        : AppColorsLight.primary;
    final List<BoxShadow> shadow =
        AppShadows.heroForBrightness(brightness);

    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: const BorderRadius.all(Radius.circular(AppRadius.r4xl)),
        boxShadow: shadow,
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          if (decoration != null) decoration!,
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Net balance
              AppAmount(
                value: netAmount,
                sign: netSign,
                label: netLabel,
                style: AppTextStyles.display.copyWith(
                  color: AppColorsLight.onPrimary,
                ),
              ),
              const SizedBox(height: AppDimensions.size20),
              // Two inner stat tiles
              Row(
                children: [
                  Expanded(
                    child: _InnerTile(
                      label: 'Owed to you',
                      amount: owedAmount,
                      sign: AmountSign.positive,
                    ),
                  ),
                  const SizedBox(width: AppDimensions.size10),
                  Expanded(
                    child: _InnerTile(
                      label: 'You owe',
                      amount: oweAmount,
                      sign: AmountSign.negative,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InnerTile extends StatelessWidget {
  const _InnerTile({
    required this.label,
    required this.amount,
    required this.sign,
  });

  final String label;
  final String amount;
  final AmountSign sign;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0x24FFFFFF), // rgba(255,255,255,0.14)
        borderRadius: const BorderRadius.all(Radius.circular(AppRadius.xl)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: AppTextStyles.micro.copyWith(
              color: AppColorsLight.onPrimary.withValues(alpha: 0.75),
            ),
          ),
          const SizedBox(height: AppDimensions.size4),
          AppAmount(
            value: amount,
            sign: sign,
            style: AppTextStyles.bodyStrong.copyWith(
              color: AppColorsLight.onPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
