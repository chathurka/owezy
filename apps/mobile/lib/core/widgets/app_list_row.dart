import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_radius.dart';
import '../theme/app_text_styles.dart';
import 'app_amount.dart';

/// Owezy list row — expense / settlement row in group details and activity.
///
/// Design source: DESIGN_SPEC §2 — List row.
/// - 44×44 category tile (radius 14), title 15/600, meta 12/500 muted.
/// - Right-aligned amount 15/700 + note 11/500.
/// - Row padding 10–11 vertical; dividers handled externally.
///
/// ```dart
/// AppListRow(
///   leading: Container(width: 44, height: 44, ...),
///   title: 'Dinner at Zara',
///   meta: 'Lisbon Trip · Maya paid',
///   amount: '\$48.00',
///   amountSign: AmountSign.positive,
///   amountNote: 'you get back',
///   onTap: () {},
/// )
/// ```
class AppListRow extends StatelessWidget {
  const AppListRow({
    super.key,
    required this.leading,
    required this.title,
    required this.amount,
    required this.amountSign,
    this.meta,
    this.amountNote,
    this.onTap,
  });

  final Widget leading;
  final String title;
  final String? meta;
  final String amount;
  final AmountSign amountSign;
  final String? amountNote;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Row(
          children: [
            leading,
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: AppTextStyles.body.copyWith(color: context.appText),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (meta != null)
                    Text(
                      meta!,
                      style: AppTextStyles.caption.copyWith(
                          color: context.appTextMuted),
                    ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisSize: MainAxisSize.min,
              children: [
                AppAmount(
                  value: amount,
                  sign: amountSign,
                  style: AppTextStyles.bodyStrong.copyWith(fontSize: 15),
                ),
                if (amountNote != null)
                  Text(
                    amountNote!,
                    style: AppTextStyles.micro.copyWith(
                        color: context.appTextMuted,
                        fontWeight: FontWeight.w500),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// Category tile used in list rows — 44×44, radius 14.
class AppCategoryTile extends StatelessWidget {
  const AppCategoryTile({
    super.key,
    required this.icon,
    required this.bg,
    required this.fg,
    this.size = 44.0,
    this.radius = AppRadius.md, // 14
  });

  final Widget icon;
  final Color bg;
  final Color fg;
  final double size;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.all(Radius.circular(radius)),
      ),
      alignment: Alignment.center,
      child: IconTheme(
        data: IconThemeData(color: fg, size: 20),
        child: icon,
      ),
    );
  }
}
