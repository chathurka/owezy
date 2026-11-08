import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_assets.dart';
import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../controllers/login_controller.dart';
import '../widgets/register_form_field.dart';

// Design source: resources/owezy-mobile/prototype/screens/SignIn.dc.html
// Frame ~390×844 · side padding 24 · Welcome back + social + email form

class LoginPage extends GetView<LoginController> {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: context.appSurface,
      body: ListView(
        padding: const EdgeInsets.fromLTRB(
          AppSpacing.s6,
          AppSpacing.safeTop,
          AppSpacing.s6,
          AppSpacing.s8,
        ),
        children: [
          Row(
            children: [
              Container(
                width: AppSpacing.touchMin,
                height: AppSpacing.touchMin,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: context.appPrimary,
                  borderRadius: const BorderRadius.all(
                    Radius.circular(AppRadius.md),
                  ),
                ),
                child: Text(
                  'O',
                  style: AppTextStyles.title.copyWith(
                    color: context.appOnPrimary,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.s3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(l10n.loginTitle, style: AppTextStyles.title),
                    const SizedBox(height: AppDimensions.size4),
                    Text(
                      l10n.loginSubtitle,
                      style: AppTextStyles.body.copyWith(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: context.appTextMuted,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppDimensions.size),
          Obx(
            () => _SocialButton(
              label: l10n.loginContinueGoogle,
              isApple: false,
              onPressed: controller.isSubmitting.value
                  ? null
                  : () => controller.continueWithGoogle(l10n),
            ),
          ),
          const SizedBox(height: AppDimensions.size16),
          _OrDivider(label: l10n.loginOrEmail),
          const SizedBox(height: AppDimensions.size16),
          Obx(
            () => RegisterFormField(
              label: l10n.loginEmailLabel,
              placeholder: l10n.loginEmailPlaceholder,
              iconAsset: AppAssets.iconMail,
              keyboardType: TextInputType.emailAddress,
              errorText: controller.fieldErrors['email'],
              onChanged: (v) => controller.email.value = v,
            ),
          ),
          const SizedBox(height: AppDimensions.size12),
          Obx(
            () => RegisterFormField(
              label: l10n.loginPasswordLabel,
              placeholder: l10n.loginPasswordPlaceholder,
              iconAsset: AppAssets.iconLock,
              obscureText: controller.obscurePassword.value,
              errorText: controller.fieldErrors['password'],
              onChanged: (v) => controller.password.value = v,
              suffix: IconButton(
                onPressed: controller.toggleObscure,
                tooltip: controller.obscurePassword.value
                    ? l10n.loginShowPasswordAria
                    : l10n.loginHidePasswordAria,
                icon: Icon(
                  controller.obscurePassword.value
                      ? Icons.visibility_outlined
                      : Icons.visibility_off_outlined,
                  color: context.appTextMuted,
                  size: AppDimensions.size20,
                ),
              ),
            ),
          ),
          const SizedBox(height: AppDimensions.size12),
          Row(
            children: [
              Expanded(
                child: Obx(
                  () => GestureDetector(
                    onTap: controller.toggleRememberMe,
                    child: Row(
                      children: [
                        Container(
                          width: AppDimensions.size20,
                          height: AppDimensions.size20,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: controller.rememberMe.value
                                ? context.appPrimary
                                : context.appSurface,
                            borderRadius: const BorderRadius.all(
                              Radius.circular(6),
                            ),
                            border: Border.all(
                              color: controller.rememberMe.value
                                  ? context.appPrimary
                                  : context.appBorderStrong,
                              width: AppDimensions.size1_5,
                            ),
                          ),
                          child: controller.rememberMe.value
                              ? Icon(
                                  Icons.check,
                                  size: AppDimensions.size14,
                                  color: context.appOnPrimary,
                                )
                              : null,
                        ),
                        const SizedBox(width: AppDimensions.size10),
                        Flexible(
                          child: Text(
                            l10n.loginRememberMe,
                            style: AppTextStyles.label.copyWith(
                              color: context.appTextMuted,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              TextButton(
                onPressed: () => Get.toNamed(AppRoutes.forgotPassword),
                child: Text(
                  l10n.loginForgotPassword,
                  style: AppTextStyles.label.copyWith(
                    fontWeight: FontWeight.w700,
                    color: context.appAccentText,
                  ),
                ),
              ),
            ],
          ),
          Obx(() {
            final err = controller.formError.value;
            if (err == null) return const SizedBox.shrink();
            final message = err == '__session_expired__'
                ? l10n.loginSessionExpired
                : err;
            return Padding(
              padding: const EdgeInsets.only(top: 8, bottom: 4),
              child: Text(
                message,
                style: AppTextStyles.caption.copyWith(color: context.appOwe),
              ),
            );
          }),
          const SizedBox(height: AppDimensions.size12),
          Obx(
            () => AppButton(
              label: controller.isSubmitting.value
                  ? l10n.loginSubmitting
                  : l10n.loginSubmit,
              onPressed: controller.isSubmitting.value
                  ? null
                  : () => controller.submit(l10n),
            ),
          ),
          const SizedBox(height: AppDimensions.size20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                l10n.loginCreatePrompt,
                style: AppTextStyles.label.copyWith(
                  color: context.appTextMuted,
                ),
              ),
              TextButton(
                onPressed: () => Get.toNamed(AppRoutes.register),
                child: Text(
                  l10n.loginCreateAccount,
                  style: AppTextStyles.label.copyWith(
                    fontWeight: FontWeight.w700,
                    color: context.appAccentText,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SocialButton extends StatelessWidget {
  const _SocialButton({
    required this.label,
    required this.isApple,
    this.onPressed,
  });

  final String label;
  final bool isApple;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: AppDimensions.size52,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: context.appSurface,
          disabledForegroundColor: context.appText,
          foregroundColor: context.appText,
          side: BorderSide(color: context.appBorderStrong),
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(AppRadius.lg)),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: AppDimensions.size22,
              height: AppDimensions.size22,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: isApple ? context.appText : context.appSurface,
                borderRadius: BorderRadius.all(
                  Radius.circular(isApple ? 7 : 11),
                ),
                border: isApple
                    ? null
                    : Border.all(
                        color: context.appBorderStrong,
                        width: AppDimensions.size1_5,
                      ),
              ),
              child: isApple
                  ? null
                  : Text(
                      'G',
                      style: AppTextStyles.label.copyWith(
                        fontWeight: FontWeight.w800,
                        color: context.appTextMuted,
                        fontSize: 13,
                      ),
                    ),
            ),
            const SizedBox(width: AppDimensions.size10),
            Text(
              label,
              style: AppTextStyles.bodyStrong.copyWith(color: context.appText),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrDivider extends StatelessWidget {
  const _OrDivider({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Divider(color: context.appBorder, thickness: 1)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            label,
            style: AppTextStyles.caption.copyWith(
              fontWeight: FontWeight.w600,
              color: context.appTextMuted,
            ),
          ),
        ),
        Expanded(child: Divider(color: context.appBorder, thickness: 1)),
      ],
    );
  }
}
