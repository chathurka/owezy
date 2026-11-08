import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../controllers/group_onboarding_controller.dart';

class GroupOnboardingPage extends GetView<GroupOnboardingController> {
  const GroupOnboardingPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.page),
          child: Obx(() {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(l10n.onboardingGroupTitle, style: AppTextStyles.title),
                const SizedBox(height: AppSpacing.s2),
                Text(
                  l10n.onboardingGroupSubtitle,
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: AppSpacing.s6),
                if (controller.mode.value == 'choose') ...[
                  AppButton(
                    label: l10n.onboardingGroupCreate,
                    onPressed: () => controller.mode.value = 'create',
                  ),
                  const SizedBox(height: AppSpacing.s3),
                  AppButton(
                    label: l10n.onboardingGroupJoin,
                    variant: AppButtonVariant.secondary,
                    onPressed: () => controller.mode.value = 'join',
                  ),
                  const SizedBox(height: AppSpacing.s3),
                  AppButton(
                    label: l10n.onboardingGroupSkip,
                    variant: AppButtonVariant.ghost,
                    onPressed: controller.isSubmitting.value
                        ? null
                        : () => controller.skip(l10n),
                  ),
                ],
                if (controller.mode.value == 'create') ...[
                  AppTextField(
                    label: l10n.onboardingGroupNameLabel,
                    placeholder: l10n.onboardingGroupNamePlaceholder,
                    onChanged: (v) => controller.name.value = v,
                  ),
                  const SizedBox(height: AppSpacing.s4),
                  AppButton(
                    label: l10n.onboardingGroupCreateSubmit,
                    isLoading: controller.isSubmitting.value,
                    onPressed: controller.isSubmitting.value
                        ? null
                        : () => controller.create(l10n),
                  ),
                  AppButton(
                    label: l10n.onboardingGroupBack,
                    variant: AppButtonVariant.ghost,
                    onPressed: () => controller.mode.value = 'choose',
                  ),
                ],
                if (controller.mode.value == 'join') ...[
                  AppTextField(
                    label: l10n.onboardingGroupCodeLabel,
                    placeholder: l10n.onboardingGroupCodePlaceholder,
                    onChanged: (v) => controller.inviteCode.value = v,
                  ),
                  const SizedBox(height: AppSpacing.s4),
                  AppButton(
                    label: l10n.onboardingGroupJoinSubmit,
                    isLoading: controller.isSubmitting.value,
                    onPressed: controller.isSubmitting.value
                        ? null
                        : () => controller.join(l10n),
                  ),
                  AppButton(
                    label: l10n.onboardingGroupBack,
                    variant: AppButtonVariant.ghost,
                    onPressed: () => controller.mode.value = 'choose',
                  ),
                ],
                if (controller.formError.value != null) ...[
                  const SizedBox(height: AppSpacing.s3),
                  Text(
                    controller.formError.value!,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.error,
                    ),
                  ),
                ],
              ],
            );
          }),
        ),
      ),
    );
  }
}
