import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/user_profile.dart';
import '../controllers/profile_controller.dart';

class ProfilePage extends GetView<ProfileController> {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(l10n.profileTitle),
        actions: [
          Obx(
            () => IconButton(
              onPressed: () =>
                  controller.isEditing.value = !controller.isEditing.value,
              icon: Icon(
                controller.isEditing.value ? Icons.close : Icons.edit_outlined,
              ),
            ),
          ),
        ],
      ),
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
                Row(
                  children: [
                    CircleAvatar(
                      radius: AppSpacing.s8,
                      backgroundColor: AppColors.primary,
                      child: Text(
                        _initials(controller.fullName.value),
                        style: AppTextStyles.title.copyWith(
                          color: AppColors.textInverse,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.s4),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            controller.fullName.value,
                            style: AppTextStyles.title,
                          ),
                          Text(
                            controller.email.value,
                            style: AppTextStyles.caption.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.s6),
                if (controller.isEditing.value) ...[
                  AppTextField(
                    label: l10n.profileSetupFullNameLabel,
                    initialValue: controller.fullName.value,
                    errorText: controller.fieldErrors['fullName'],
                    onChanged: (v) => controller.fullName.value = v,
                  ),
                  const SizedBox(height: AppSpacing.s3),
                  AppTextField(
                    label: l10n.profileSetupPhoneLabel,
                    initialValue: controller.phone.value,
                    onChanged: (v) => controller.phone.value = v,
                  ),
                  const SizedBox(height: AppSpacing.s3),
                  AppTextField(
                    label: l10n.profileSetupPaymentHandleLabel,
                    initialValue: controller.paymentHandle.value,
                    onChanged: (v) => controller.paymentHandle.value = v,
                  ),
                  const SizedBox(height: AppSpacing.s3),
                  Text(l10n.profileSetupCurrencyLabel),
                  DropdownButtonFormField<String>(
                    value: controller.defaultCurrency.value,
                    items: kAllowedCurrencies
                        .map(
                          (c) => DropdownMenuItem(value: c, child: Text(c)),
                        )
                        .toList(),
                    onChanged: (v) {
                      if (v != null) controller.defaultCurrency.value = v;
                    },
                  ),
                  const SizedBox(height: AppSpacing.s3),
                  Text(l10n.profileSetupLanguageLabel),
                  DropdownButtonFormField<String>(
                    value: controller.preferredLocale.value,
                    items: kAllowedLocales
                        .map(
                          (c) => DropdownMenuItem(
                            value: c,
                            child: Text(
                              c == 'si'
                                  ? l10n.profileSetupLanguageSi
                                  : l10n.profileSetupLanguageEn,
                            ),
                          ),
                        )
                        .toList(),
                    onChanged: (v) {
                      if (v != null) controller.preferredLocale.value = v;
                    },
                  ),
                  const SizedBox(height: AppSpacing.s4),
                  AppButton(
                    label: controller.isSubmitting.value
                        ? l10n.profileSetupSubmitting
                        : l10n.profileSave,
                    isLoading: controller.isSubmitting.value,
                    onPressed: controller.isSubmitting.value
                        ? null
                        : () => controller.save(l10n),
                  ),
                ] else ...[
                  ListTile(
                    title: Text(l10n.profileSetupCurrencyLabel),
                    trailing: Text(controller.defaultCurrency.value),
                  ),
                  ListTile(
                    title: Text(l10n.profileSetupLanguageLabel),
                    trailing: Text(controller.preferredLocale.value),
                  ),
                ],
                if (controller.successMessage.value != null)
                  Text(
                    controller.successMessage.value!,
                    style: AppTextStyles.caption,
                  ),
                if (controller.formError.value != null)
                  Text(
                    controller.formError.value == 'load'
                        ? l10n.profileLoadError
                        : controller.formError.value!,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.error,
                    ),
                  ),
              ],
            ),
          );
        }),
      ),
    );
  }

  String _initials(String name) {
    final parts =
        name.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty).toList();
    if (parts.isEmpty) return '?';
    if (parts.length == 1) {
      return parts.first.substring(0, parts.first.length.clamp(0, 2)).toUpperCase();
    }
    return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
  }
}
