import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_dimensions.dart';
import '../theme/app_radius.dart';
import '../theme/app_shadows.dart';
import '../theme/app_text_styles.dart';

/// Owezy segmented control — track + selected item indicator.
///
/// Design source: DESIGN_SPEC §2 — Segmented control.
/// - Track `track`, padding 4, radius 14.
/// - Item 36–38h, radius 11, 13/700. Selected: `surfaceRaised` + `shadow.segmentSelected`.
/// - Selected label: `primaryText`.
///
/// ```dart
/// AppSegmentedControl(
///   items: ['Expenses', 'Balances', 'Members'],
///   selectedIndex: 0,
///   onChanged: (i) => controller.tab.value = i,
/// )
/// ```
class AppSegmentedControl extends StatelessWidget {
  const AppSegmentedControl({
    super.key,
    required this.items,
    required this.selectedIndex,
    required this.onChanged,
  });

  final List<String> items;
  final int selectedIndex;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: context.appTrack,
        borderRadius: const BorderRadius.all(Radius.circular(AppRadius.md)),
      ),
      child: Row(
        children: List.generate(items.length, (i) {
          final isSelected = i == selectedIndex;
          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                height: AppDimensions.size36,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: isSelected ? context.appSurfaceRaised : Colors.transparent,
                  borderRadius: const BorderRadius.all(Radius.circular(11)),
                  boxShadow: isSelected ? AppShadows.segmentSelected : null,
                ),
                child: Text(
                  items[i],
                  style: AppTextStyles.label.copyWith(
                    fontWeight: FontWeight.w700,
                    color: isSelected
                        ? context.appPrimaryText
                        : context.appTextMuted,
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}
