import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/user_profile.dart';
import '../controllers/profile_setup_controller.dart';

class ProfileSetupPage extends GetView<ProfileSetupController> {
  const ProfileSetupPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Obx(() {
          if (controller.isLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.page),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(l10n.profileSetupTitle, style: AppTextStyles.title),
                const SizedBox(height: AppSpacing.s2),
                Text(
                  l10n.profileSetupSubtitle,
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: AppSpacing.s6),
                Center(
                  child: CircleAvatar(
                    radius: AppSpacing.s8,
                    backgroundColor: AppColors.primary,
                    child: Text(
                      controller.initials(),
                      style: AppTextStyles.title.copyWith(
                        color: AppColors.textInverse,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.s6),
                AppTextField(
                  label: l10n.profileSetupFullNameLabel,
                  placeholder: l10n.profileSetupFullNamePlaceholder,
                  initialValue: controller.fullName.value,
                  errorText: controller.fieldErrors['fullName'],
                  onChanged: (v) => controller.fullName.value = v,
                ),
                const SizedBox(height: AppSpacing.s4),
                AppTextField(
                  label: l10n.profileSetupPhoneLabel,
                  placeholder: l10n.profileSetupPhonePlaceholder,
                  initialValue: controller.phone.value,
                  keyboardType: TextInputType.phone,
                  onChanged: (v) => controller.phone.value = v,
                ),
                const SizedBox(height: AppSpacing.s4),
                AppTextField(
                  label: l10n.profileSetupPaymentHandleLabel,
                  placeholder: l10n.profileSetupPaymentHandlePlaceholder,
                  initialValue: controller.paymentHandle.value,
                  onChanged: (v) => controller.paymentHandle.value = v,
                ),
                const SizedBox(height: AppSpacing.s4),
                Text(
                  l10n.profileSetupCurrencyLabel,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: AppSpacing.s2),
                DropdownButtonFormField<String>(
                  value: controller.defaultCurrency.value,
                  items: kAllowedCurrencies
                      .map(
                        (code) => DropdownMenuItem(
                          value: code,
                          child: Text(code),
                        ),
                      )
                      .toList(),
                  onChanged: (value) {
                    if (value != null) {
                      controller.defaultCurrency.value = value;
                    }
                  },
                ),
                const SizedBox(height: AppSpacing.s4),
                Text(
                  l10n.profileSetupLanguageLabel,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: AppSpacing.s2),
                DropdownButtonFormField<String>(
                  value: controller.preferredLocale.value,
                  items: kAllowedLocales
                      .map(
                        (code) => DropdownMenuItem(
                          value: code,
                          child: Text(
                            code == 'si'
                                ? l10n.profileSetupLanguageSi
                                : l10n.profileSetupLanguageEn,
                          ),
                        ),
                      )
                      .toList(),
                  onChanged: (value) {
                    if (value != null) {
                      controller.preferredLocale.value = value;
                    }
                  },
                ),
                if (controller.formError.value != null) ...[
                  const SizedBox(height: AppSpacing.s3),
                  Text(
                    controller.formError.value!,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.error,
                    ),
                  ),
                ],
                const SizedBox(height: AppSpacing.s6),
                AppButton(
                  label: controller.isSubmitting.value
                      ? l10n.profileSetupSubmitting
                      : l10n.profileSetupSubmit,
                  isLoading: controller.isSubmitting.value,
                  onPressed: controller.isSubmitting.value
                      ? null
                      : () => controller.submit(l10n),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }
}
