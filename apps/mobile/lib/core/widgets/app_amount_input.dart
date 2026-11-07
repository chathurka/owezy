import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_text_styles.dart';

/// Owezy large amount input — centred, 56/800, −2 tracking.
///
/// Design source: DESIGN_SPEC §2 — Amount input.
/// - Centred display, 56px/w800, −2 letter-spacing, tabular nums.
/// - 30/700 muted currency symbol to the left.
/// - Used in Add Expense and Split Expense screens.
///
/// ```dart
/// AppAmountInput(
///   currencySymbol: '\$',
///   onChanged: (v) => controller.amount.value = v,
///   placeholder: '0.00',
/// )
/// ```
class AppAmountInput extends StatelessWidget {
  const AppAmountInput({
    super.key,
    this.currencySymbol = '\$',
    this.placeholder = '0.00',
    this.controller,
    this.onChanged,
    this.focusNode,
  });

  final String currencySymbol;
  final String placeholder;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final FocusNode? focusNode;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // Currency symbol
        Text(
          currencySymbol,
          style: AppTextStyles.amountLg.copyWith(
            fontWeight: FontWeight.w700,
            fontSize: 30,
            color: context.appTextMuted,
          ),
        ),
        const SizedBox(width: 4),
        // Amount field — intrinsic width via IntrinsicWidth or expanded
        IntrinsicWidth(
          child: TextField(
            controller: controller,
            focusNode: focusNode,
            onChanged: onChanged,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            inputFormatters: [
              FilteringTextInputFormatter.allow(RegExp(r'[\d.]')),
            ],
            textAlign: TextAlign.center,
            style: AppTextStyles.display.copyWith(
              color: context.appText,
              letterSpacing: -2,
            ),
            cursorColor: context.appPrimary,
            decoration: InputDecoration(
              hintText: placeholder,
              hintStyle: AppTextStyles.display.copyWith(
                color: context.appTextMuted,
                letterSpacing: -2,
              ),
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              filled: false,
              isDense: true,
              contentPadding: EdgeInsets.zero,
            ),
          ),
        ),
      ],
    );
  }
}
