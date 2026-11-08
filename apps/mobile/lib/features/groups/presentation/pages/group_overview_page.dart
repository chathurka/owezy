import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../controllers/group_overview_controller.dart';

class GroupOverviewPage extends GetView<GroupOverviewController> {
  const GroupOverviewPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.page),
          child: Obx(() {
            if (controller.isLoading.value && controller.overview.value == null) {
              return const Center(child: CircularProgressIndicator());
            }
            if (controller.error.value != null &&
                controller.overview.value == null) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  AppButton(
                    label: l10n.groupsCreateBack,
                    variant: AppButtonVariant.ghost,
                    onPressed: Get.back,
                  ),
                  Text(
                    controller.error.value!,
                    style: AppTextStyles.body.copyWith(color: AppColors.danger),
                  ),
                ],
              );
            }
            final data = controller.overview.value!;
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                AppButton(
                  label: l10n.groupsCreateBack,
                  variant: AppButtonVariant.ghost,
                  onPressed: Get.back,
                ),
                const SizedBox(height: AppSpacing.s3),
                Text(data.name, style: AppTextStyles.title),
                const SizedBox(height: AppSpacing.s2),
                Text(
                  '${data.role == 'owner' ? l10n.groupsRoleOwner : l10n.groupsRoleMember} · ${l10n.groupsOverviewMembers(data.memberCount)}',
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: AppSpacing.s6),
                Text(
                  l10n.groupsOverviewEmptyActivity,
                  style: AppTextStyles.body,
                ),
              ],
            );
          }),
        ),
      ),
    );
  }
}
