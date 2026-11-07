import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_radius.dart';
import '../theme/app_text_styles.dart';
import 'app_amount.dart';
import 'app_avatar.dart';
import 'app_badge.dart';

/// Group card data model.
class AppGroupCardData {
  const AppGroupCardData({
    required this.name,
    required this.categoryIcon,
    required this.categoryBg,
    required this.categoryFg,
    required this.members,
    required this.amount,
    required this.amountSign,
    required this.meta,
    this.note,
    this.onTap,
  });

  final String name;
  final Widget categoryIcon;
  final Color categoryBg;
  final Color categoryFg;
  final List<AppAvatar> members;
  final String amount;
  final AmountSign amountSign;
  final String meta;
  final String? note;
  final VoidCallback? onTap;
}

/// Owezy group card — surface, radius 22, padding 14.
///
/// Design source: DESIGN_SPEC §2 — Group card.
/// - 52×52 category tile (radius 16), title 15/700, avatar stack.
/// - Right column: note 11/600 muted + amount 15/800 coloured.
///
/// ```dart
/// AppGroupCard(data: AppGroupCardData(
///   name: 'Lisbon Trip',
///   categoryIcon: SvgPicture.asset(AppAssets.iconTravel),
///   categoryBg: AppColorsLight.catTravelBg,
///   categoryFg: AppColorsLight.catTravelFg,
///   members: [AppAvatar(initials: 'Y', size: 24), ...],
///   amount: '\$145.00',
///   amountSign: AmountSign.negative,
///   meta: '5 expenses · 3 members',
/// ))
/// ```
class AppGroupCard extends StatelessWidget {
  const AppGroupCard({super.key, required this.data});

  final AppGroupCardData data;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: data.onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: context.appSurface,
          borderRadius: AppRadius.groupCard,
          border: context.isDark
              ? null
              : Border.all(color: context.appBorder),
        ),
        child: Row(
          children: [
            // Category tile 52×52, radius 16
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: data.categoryBg,
                borderRadius: const BorderRadius.all(
                    Radius.circular(AppRadius.lg)),
              ),
              alignment: Alignment.center,
              child: IconTheme(
                data: IconThemeData(color: data.categoryFg, size: 24),
                child: data.categoryIcon,
              ),
            ),
            const SizedBox(width: 12),
            // Name + members
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    data.name,
                    style: AppTextStyles.bodyStrong.copyWith(
                        color: context.appText),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    data.meta,
                    style: AppTextStyles.caption.copyWith(
                        color: context.appTextMuted),
                  ),
                  const SizedBox(height: 6),
                  AppAvatarStack(avatars: data.members, size: 24),
                ],
              ),
            ),
            const SizedBox(width: 12),
            // Amount + note
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisSize: MainAxisSize.min,
              children: [
                if (data.note != null)
                  Text(
                    data.note!,
                    style: AppTextStyles.micro.copyWith(
                        color: context.appTextMuted),
                  ),
                AppAmount(
                  value: data.amount,
                  sign: data.amountSign,
                  style: AppTextStyles.bodyStrong.copyWith(
                    fontWeight: FontWeight.w800,
                    fontSize: 15,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
