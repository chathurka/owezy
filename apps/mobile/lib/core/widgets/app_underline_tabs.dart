import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_text_styles.dart';

/// Owezy underline tabs — used in Group details.
///
/// Design source: DESIGN_SPEC §2 — Underline tabs.
/// - 14/600 `textMuted`; selected: 14/700 `primaryText` + 2.5px `primary` underline.
/// - 22px gap between items; 1px `borderStrong` baseline.
///
/// ```dart
/// AppUnderlineTabs(
///   tabs: ['Expenses', 'Balances', 'Members'],
///   selectedIndex: 0,
///   onChanged: (i) => controller.tab.value = i,
/// )
/// ```
class AppUnderlineTabs extends StatelessWidget {
  const AppUnderlineTabs({
    super.key,
    required this.tabs,
    required this.selectedIndex,
    required this.onChanged,
  });

  final List<String> tabs;
  final int selectedIndex;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            for (var i = 0; i < tabs.length; i++) ...[
              if (i > 0) const SizedBox(width: 22),
              GestureDetector(
                onTap: () => onChanged(i),
                child: _TabItem(
                  label: tabs[i],
                  isSelected: i == selectedIndex,
                ),
              ),
            ],
          ],
        ),
        Container(height: 1, color: context.appBorderStrong),
      ],
    );
  }
}

class _TabItem extends StatelessWidget {
  const _TabItem({required this.label, required this.isSelected});

  final String label;
  final bool isSelected;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Text(
            label,
            style: AppTextStyles.label.copyWith(
              fontSize: 14,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
              color: isSelected ? context.appPrimaryText : context.appTextMuted,
            ),
          ),
        ),
        // Underline indicator
        Container(
          height: 2.5,
          width: double.infinity,
          color: isSelected ? context.appPrimary : Colors.transparent,
        ),
      ],
    );
  }
}
