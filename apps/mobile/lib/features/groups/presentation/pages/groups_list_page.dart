import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_group_card.dart';
import '../../../../core/widgets/app_amount.dart';
import '../../../../core/widgets/app_avatar.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../controllers/groups_list_controller.dart';

class GroupsListPage extends GetView<GroupsListController> {
  const GroupsListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.page),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: AppSpacing.s6),
              Row(
                children: [
                  Expanded(
                    child: Text(l10n.groupsTitle, style: AppTextStyles.title),
                  ),
                  AppButton(
                    label: l10n.groupsNew,
                    size: AppButtonSize.small,
                    onPressed: () => Get.toNamed(AppRoutes.createGroup),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.s2),
              Text(
                l10n.groupsSubtitle,
                style: AppTextStyles.body.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: AppSpacing.s4),
              Expanded(
                child: Obx(() {
                  if (controller.isLoading.value && controller.items.isEmpty) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (controller.error.value != null &&
                      controller.items.isEmpty) {
                    return Center(
                      child: Text(
                        controller.error.value!,
                        style: AppTextStyles.body.copyWith(
                          color: AppColors.danger,
                        ),
                      ),
                    );
                  }
                  if (controller.items.isEmpty) {
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          l10n.groupsEmpty,
                          style: AppTextStyles.body.copyWith(
                            color: AppColors.textSecondary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppSpacing.s4),
                        AppButton(
                          label: l10n.groupsNew,
                          onPressed: () => Get.toNamed(AppRoutes.createGroup),
                        ),
                      ],
                    );
                  }
                  return ListView.separated(
                    itemCount: controller.items.length,
                    separatorBuilder: (_, __) =>
                        const SizedBox(height: AppSpacing.s3),
                    itemBuilder: (context, index) {
                      final group = controller.items[index];
                      return AppGroupCard(
                        data: AppGroupCardData(
                          name: group.name,
                          categoryIcon: Icon(
                            Icons.groups_outlined,
                            color: AppColors.primary,
                          ),
                          categoryBg: AppColors.primarySoft,
                          categoryFg: AppColors.primary,
                          members: [
                            AppAvatar(
                              initials: group.name.isNotEmpty
                                  ? group.name[0].toUpperCase()
                                  : 'G',
                              size: AppDimensions.size32,
                            ),
                          ],
                          amount: '—',
                          amountSign: AmountSign.neutral,
                          meta:
                              '${group.role == 'owner' ? l10n.groupsRoleOwner : l10n.groupsRoleMember} · ${l10n.groupsOverviewMembers(group.memberCount)}',
                          onTap: () => Get.toNamed(
                            AppRoutes.groupOverview.replaceFirst(
                              ':id',
                              group.id,
                            ),
                          ),
                        ),
                      );
                    },
                  );
                }),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
