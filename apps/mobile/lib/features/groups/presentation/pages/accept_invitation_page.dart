import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../controllers/accept_invitation_controller.dart';

class AcceptInvitationPage extends GetView<AcceptInvitationController> {
  const AcceptInvitationPage({super.key});

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
                Text(l10n.groupsAcceptTitle, style: AppTextStyles.title),
                const SizedBox(height: AppSpacing.s2),
                Text(
                  l10n.groupsAcceptSubtitle,
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: AppSpacing.s6),
                AppTextField(
                  label: l10n.groupsAcceptTokenLabel,
                  onChanged: (v) => controller.token.value = v,
                ),
                if (controller.formError.value != null) ...[
                  const SizedBox(height: AppSpacing.s3),
                  Text(
                    controller.formError.value!,
                    style: AppTextStyles.body.copyWith(color: AppColors.danger),
                  ),
                ],
                const SizedBox(height: AppSpacing.s4),
                AppButton(
                  label: l10n.groupsAcceptSubmit,
                  isLoading: controller.isSubmitting.value,
                  onPressed: controller.isSubmitting.value
                      ? null
                      : () => controller.submit(l10n),
                ),
              ],
            );
          }),
        ),
      ),
    );
  }
}
