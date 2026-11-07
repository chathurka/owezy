import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_colors_ext.dart';
import '../theme/app_text_styles.dart';

/// Chip style from DESIGN_SPEC §2 — Chip.
enum AppChipStyle {
  /// Filter chip — 36h, pill radius, border in unselected; primary fill when selected.
  filter,

  /// Category chip — 40h, pill radius, coloured bg/fg per category.
  category,
}

/// Category for colour-coded category chips.
enum AppChipCategory {
  food,
  bills,
  travel,
  settlement,
  groceries,
  entertainment,
}

/// Owezy chip — pill radius, 13/600, 36h (category 40h).
///
/// Design source: DESIGN_SPEC §2 — Chip.
/// - Filter chip: unselected = 1px borderStrong + textMuted; selected = primary fill + white.
/// - Category chip: coloured bg/fg from token palette; not selectable by itself.
///
/// ```dart
/// // Filter chip group
/// AppChip(label: 'All · 5', isSelected: true, onTap: () {})
/// AppChip(label: 'Owed to you', onTap: () {})
///
/// // Category chip (non-interactive — decorative in list rows)
/// AppChip.category(label: 'Food', category: AppChipCategory.food)
/// ```
class AppChip extends StatelessWidget {
  const AppChip({
    super.key,
    required this.label,
    this.isSelected = false,
    this.onTap,
    this.style = AppChipStyle.filter,
    this.leadingIcon,
  }) : _category = null;

  /// Non-interactive category chip with palette colours.
  const AppChip.category({
    super.key,
    required this.label,
    required AppChipCategory category,
  })  : isSelected = false,
        onTap = null,
        style = AppChipStyle.category,
        leadingIcon = null,
        _category = category;

  final String label;
  final bool isSelected;
  final VoidCallback? onTap;
  final AppChipStyle style;
  final Widget? leadingIcon;
  final AppChipCategory? _category;

  @override
  Widget build(BuildContext context) {
    final double height = style == AppChipStyle.category ? 40.0 : 36.0;

    final Color bg;
    final Color fg;
    final Border? border;

    if (style == AppChipStyle.category && _category != null) {
      (bg, fg) = _categoryColors(context, _category);
      border = null;
    } else if (isSelected) {
      bg = context.appPrimary;
      fg = context.appOnPrimary;
      border = null;
    } else {
      bg = Colors.transparent;
      fg = context.appTextMuted;
      border = Border.all(color: context.appBorderStrong);
    }

    Widget chip = Container(
      height: height,
      padding: const EdgeInsets.symmetric(horizontal: 14),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: border,
      ),
      alignment: Alignment.center,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (leadingIcon != null) ...[leadingIcon!, const SizedBox(width: 6)],
          Text(
            label,
            style: AppTextStyles.label.copyWith(
              color: fg,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );

    if (onTap != null) {
      chip = GestureDetector(onTap: onTap, child: chip);
    }
    return chip;
  }

  static (Color, Color) _categoryColors(BuildContext context, AppChipCategory cat) {
    final dark = context.isDark;
    return switch (cat) {
      AppChipCategory.food => dark
          ? (AppColorsDark.catFoodBg, AppColorsDark.catFoodFg)
          : (AppColorsLight.catFoodBg, AppColorsLight.catFoodFg),
      AppChipCategory.bills => dark
          ? (AppColorsDark.catBillsBg, AppColorsDark.catBillsFg)
          : (AppColorsLight.catBillsBg, AppColorsLight.catBillsFg),
      AppChipCategory.travel => dark
          ? (AppColorsDark.catTravelBg, AppColorsDark.catTravelFg)
          : (AppColorsLight.catTravelBg, AppColorsLight.catTravelFg),
      AppChipCategory.settlement => dark
          ? (AppColorsDark.catSettlementBg, AppColorsDark.catSettlementFg)
          : (AppColorsLight.catSettlementBg, AppColorsLight.catSettlementFg),
      AppChipCategory.groceries => dark
          ? (AppColorsDark.catGroceriesBg, AppColorsDark.catGroceriesFg)
          : (AppColorsLight.catGroceriesBg, AppColorsLight.catGroceriesFg),
      AppChipCategory.entertainment => dark
          ? (AppColorsDark.catEntertainmentBg, AppColorsDark.catEntertainmentFg)
          : (AppColorsLight.catEntertainmentBg, AppColorsLight.catEntertainmentFg),
    };
  }
}
