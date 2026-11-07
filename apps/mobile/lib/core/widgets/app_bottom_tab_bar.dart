import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_colors.dart';
import '../theme/app_radius.dart';
import '../theme/app_shadows.dart';
import '../theme/app_text_styles.dart';

/// Tab item data for [AppBottomTabBar].
class AppTabItem {
  const AppTabItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });

  final IconData icon;
  final IconData activeIcon;
  final String label;
}

/// Owezy bottom tab bar — 88h, surface, top border.
///
/// Design source: DESIGN_SPEC §2 — Bottom tab bar.
/// - 88h (incl. home-indicator space), `surface`, top border.
/// - Items: Home, Groups, [+FAB], Activity, Insights. Item 64w, icon 24, label 11.
/// - Active: `primaryText` 700 + home icon filled with `primarySoft` bg.
/// - Centre FAB: 56×56 radius 20, raised −26, `shadow.fab` (light only).
///
/// ```dart
/// AppBottomTabBar(
///   tabs: [
///     AppTabItem(icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Home'),
///     AppTabItem(icon: Icons.group_outlined, activeIcon: Icons.group, label: 'Groups'),
///     AppTabItem(icon: Icons.add, activeIcon: Icons.add, label: ''),  // FAB slot
///     AppTabItem(icon: Icons.timeline_outlined, activeIcon: Icons.timeline, label: 'Activity'),
///     AppTabItem(icon: Icons.bar_chart_outlined, activeIcon: Icons.bar_chart, label: 'Insights'),
///   ],
///   selectedIndex: 0,
///   onTap: (i) => controller.navIndex.value = i,
///   onFabTap: () => Get.toNamed(AppRoutes.addExpense),
/// )
/// ```
class AppBottomTabBar extends StatelessWidget {
  const AppBottomTabBar({
    super.key,
    required this.tabs,
    required this.selectedIndex,
    required this.onTap,
    this.onFabTap,
    this.fabIndex = 2,
  });

  final List<AppTabItem> tabs;
  final int selectedIndex;
  final ValueChanged<int> onTap;
  final VoidCallback? onFabTap;

  /// Which index is the centre FAB (default 2).
  final int fabIndex;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    return Container(
      height: 88,
      decoration: BoxDecoration(
        color: context.appSurface,
        border: Border(top: BorderSide(color: context.appBorder)),
      ),
      child: SafeArea(
        top: false,
        child: Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.topCenter,
          children: [
            Row(
              children: List.generate(tabs.length, (i) {
                if (i == fabIndex) {
                  // Empty slot — FAB overlaps here
                  return const Expanded(child: SizedBox.shrink());
                }
                return Expanded(child: _NavItem(
                  item: tabs[i],
                  isSelected: selectedIndex == i,
                  onTap: () => onTap(i),
                ));
              }),
            ),
            // Centre FAB — raised −26 above tab bar
            Positioned(
              top: -26,
              child: _FAB(onTap: onFabTap, brightness: brightness),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  final AppTabItem item;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        height: 62,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isSelected ? item.activeIcon : item.icon,
              size: 24,
              color: isSelected ? context.appPrimaryText : context.appTextMuted,
            ),
            if (item.label.isNotEmpty) ...[
              const SizedBox(height: 2),
              Text(
                item.label,
                style: AppTextStyles.micro.copyWith(
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                  color: isSelected
                      ? context.appPrimaryText
                      : context.appTextMuted,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _FAB extends StatelessWidget {
  const _FAB({required this.onTap, required this.brightness});

  final VoidCallback? onTap;
  final Brightness brightness;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          color: AppColorsLight.primary, // same in both modes
          borderRadius: const BorderRadius.all(Radius.circular(AppRadius.r2xl)), // 20≈22
          boxShadow: AppShadows.fabForBrightness(brightness),
        ),
        child: const Icon(
          Icons.add,
          size: 24,
          color: Colors.white,
        ),
      ),
    );
  }
}
