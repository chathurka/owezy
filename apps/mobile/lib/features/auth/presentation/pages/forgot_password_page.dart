import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_assets.dart';
import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../controllers/forgot_password_controller.dart';
import '../widgets/auth_chrome.dart';
import '../widgets/register_form_field.dart';

// Design source: adapted from Figma Sign in chrome (no dedicated forgot frame)
// https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-4675
// Frame ~390×844 · side padding 24 · AuthBackButton + title stack

class ForgotPasswordPage extends GetView<ForgotPasswordController> {
  const ForgotPasswordPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: context.appSurface,
      body: Obx(() {
        if (controller.didSucceed.value) {
          return _SuccessView(
            title: l10n.forgotPasswordSuccessTitle,
            body: l10n.forgotPasswordSuccessBody,
            buttonLabel: l10n.forgotPasswordBackToSignIn,
            onPressed: controller.goToSignIn,
          );
        }
        return ListView(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.s6,
            AppSpacing.safeTop,
            AppSpacing.s6,
            AppSpacing.s8,
          ),
          children: [
            const AuthBackButton(),
            const SizedBox(height: AppDimensions.size20),
            Text(l10n.forgotPasswordTitle, style: AppTextStyles.title),
            const SizedBox(height: AppDimensions.size6),
            Text(
              l10n.forgotPasswordSubtitle,
              style: AppTextStyles.body.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: context.appTextMuted,
              ),
            ),
            const SizedBox(height: AppDimensions.size),
            Obx(
              () => RegisterFormField(
                label: l10n.forgotPasswordEmailLabel,
                placeholder: l10n.forgotPasswordEmailPlaceholder,
                iconAsset: AppAssets.iconMail,
                keyboardType: TextInputType.emailAddress,
                errorText: controller.fieldError.value,
                onChanged: (v) => controller.email.value = v,
              ),
            ),
            const SizedBox(height: AppDimensions.size8),
            Obx(() {
              final err = controller.formError.value;
              if (err == null) return const SizedBox.shrink();
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(
                  err,
                  style: AppTextStyles.caption.copyWith(color: context.appOwe),
                ),
              );
            }),
            const SizedBox(height: AppDimensions.size12),
            Obx(
              () => AppButton(
                label: controller.isSubmitting.value
                    ? l10n.forgotPasswordSubmitting
                    : l10n.forgotPasswordSubmit,
                onPressed: controller.isSubmitting.value
                    ? null
                    : () => controller.submit(l10n),
                isLoading: controller.isSubmitting.value,
              ),
            ),
          ],
        );
      }),
    );
  }
}

class _SuccessView extends StatelessWidget {
  const _SuccessView({
    required this.title,
    required this.body,
    required this.buttonLabel,
    required this.onPressed,
  });

  final String title;
  final String body;
  final String buttonLabel;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.s6,
        AppSpacing.safeTop,
        AppSpacing.s6,
        AppSpacing.s8,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: AppDimensions.size64,
            height: AppDimensions.size64,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: context.appOwedSoft,
              borderRadius: AppRadius.contentCard,
            ),
            child: Icon(
              Icons.check_rounded,
              color: context.appOwed,
              size: AppDimensions.size32,
            ),
          ),
          const SizedBox(height: AppDimensions.size),
          Text(title, style: AppTextStyles.title, textAlign: TextAlign.center),
          const SizedBox(height: AppDimensions.size12),
          Text(
            body,
            style: AppTextStyles.body.copyWith(color: context.appTextMuted),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppDimensions.size32),
          AppButton(label: buttonLabel, onPressed: onPressed),
        ],
      ),
    );
  }
}
