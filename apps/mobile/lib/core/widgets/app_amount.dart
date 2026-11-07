import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_text_styles.dart';

/// Money sign — required by the financial integrity rule (ADR-0006, DESIGN_SPEC §1).
///
/// - [positive]: "owed to you / you lent" → green, prefixed `+`.
/// - [negative]: "you owe / you borrowed" → orange, prefixed `−`.
/// - [neutral]: total/plain cost → main text colour, no sign.
enum AmountSign { positive, negative, neutral }

/// Owezy amount display — enforces the money colour rule.
///
/// **Rule (non-negotiable):** Money colours are NEVER used alone.
/// [AppAmount] enforces this by either:
///   - Prepending the correct sign (`+` / `−`) automatically, OR
///   - Requiring an explicit [label] ("owed to you" / "you owe") shown below.
///
/// Design source: DESIGN_SPEC §1 Money colour rules, §2 List row amounts.
///
/// ```dart
/// // With sign — most common
/// AppAmount(value: '\$48.00', sign: AmountSign.positive)   // → "+$48.00" in green
/// AppAmount(value: '\$18.50', sign: AmountSign.negative)   // → "−$18.50" in orange
///
/// // With label instead of sign (e.g., hero card)
/// AppAmount(
///   value: '\$842.50',
///   sign: AmountSign.positive,
///   label: 'owed to you',
///   showSignPrefix: false,
/// )
///
/// // Neutral — expense total, no colour override
/// AppAmount(value: '\$215.00', sign: AmountSign.neutral)
/// ```
class AppAmount extends StatelessWidget {
  const AppAmount({
    super.key,
    required this.value,
    required this.sign,
    this.label,
    this.showSignPrefix = true,
    this.style,
    this.labelStyle,
  }) : assert(
          showSignPrefix || label != null,
          'AppAmount: set showSignPrefix=true OR provide a label — never rely on colour alone.',
        );

  /// Formatted value string, e.g. `'\$48.00'`. Do NOT include +/− here.
  final String value;
  final AmountSign sign;

  /// Optional label displayed below the value (e.g., "owed to you").
  /// Required if [showSignPrefix] is false.
  final String? label;

  /// Whether to automatically prepend + or − to the value text.
  final bool showSignPrefix;

  /// Override text style (defaults to [AppTextStyles.amount]).
  final TextStyle? style;

  /// Override label text style (defaults to [AppTextStyles.micro] muted).
  final TextStyle? labelStyle;

  @override
  Widget build(BuildContext context) {
    final Color color = switch (sign) {
      AmountSign.positive => context.appOwed,
      AmountSign.negative => context.appOwe,
      AmountSign.neutral  => context.appText,
    };

    final String prefix = !showSignPrefix
        ? ''
        : switch (sign) {
            AmountSign.positive => '+',
            AmountSign.negative => '−',
            AmountSign.neutral  => '',
          };

    final baseStyle = (style ?? AppTextStyles.amount).copyWith(color: color);

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('$prefix$value', style: baseStyle),
        if (label != null)
          Text(
            label!,
            style: (labelStyle ?? AppTextStyles.micro)
                .copyWith(color: context.appTextMuted),
          ),
      ],
    );
  }
}
