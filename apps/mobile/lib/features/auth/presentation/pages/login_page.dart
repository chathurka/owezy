import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_assets.dart';
import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../controllers/login_controller.dart';
import '../widgets/auth_chrome.dart';
import '../widgets/register_form_field.dart';

// Design source: Figma Owezy Mobile — Sign in node 1:4675
// https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-4675
// Frame 390×844 · padding top 56 / sides 24 · sticky footer

class LoginPage extends GetView<LoginController> {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: context.appSurface,
      body: Stack(
        children: [
          ListView(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.s6,
              AppSpacing.safeTop,
              AppSpacing.s6,
              100,
            ),
            children: [
              AuthBackButton(
                onPressed: () {
                  if (Navigator.of(context).canPop()) {
                    Get.back<void>();
                  } else {
                    Get.offAllNamed(AppRoutes.welcome);
                  }
                },
              ),
              const SizedBox(height: AppDimensions.size18),
              Row(
                children: [
                  const AuthBrandMark(),
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
              const SizedBox(height: AppDimensions.size18),
              Obx(
                () => AuthSocialButton(
                  label: l10n.loginContinueApple,
                  isApple: true,
                  onPressed: controller.isSubmitting.value
                      ? null
                      : () => controller.continueWithApple(l10n),
                ),
              ),
              const SizedBox(height: AppDimensions.size10),
              Obx(
                () => AuthSocialButton(
                  label: l10n.loginContinueGoogle,
                  isApple: false,
                  onPressed: controller.isSubmitting.value
                      ? null
                      : () => controller.continueWithGoogle(l10n),
                ),
              ),
              const SizedBox(height: AppDimensions.size16),
              AuthOrDivider(label: l10n.loginOrEmail),
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
                    style: IconButton.styleFrom(
                      minimumSize: const Size(
                        AppDimensions.size34,
                        AppDimensions.size34,
                      ),
                      padding: EdgeInsets.zero,
                    ),
                    icon: SvgPicture.asset(
                      controller.obscurePassword.value
                          ? AppAssets.iconEye
                          : AppAssets.iconEyeOff,
                      width: AppDimensions.size20,
                      height: AppDimensions.size20,
                      colorFilter: ColorFilter.mode(
                        context.appTextMuted,
                        BlendMode.srcIn,
                      ),
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
                              width: AppDimensions.size22,
                              height: AppDimensions.size22,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: controller.rememberMe.value
                                    ? context.appPrimary
                                    : context.appSurface,
                                borderRadius: const BorderRadius.all(
                                  Radius.circular(AppDimensions.size7),
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
                            const SizedBox(width: AppDimensions.size8),
                            Flexible(
                              child: Text(
                                l10n.loginRememberMe,
                                style: AppTextStyles.label.copyWith(
                                  color: context.appTextSecondary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => Get.toNamed(AppRoutes.forgotPassword),
                    child: Text(
                      l10n.loginForgotPassword,
                      style: AppTextStyles.label.copyWith(
                        fontWeight: FontWeight.w700,
                        color: context.appPrimary,
                        decoration: TextDecoration.underline,
                        decorationColor: context.appPrimary,
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
                  isLoading: controller.isSubmitting.value,
                ),
              ),
            ],
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: AuthStickyFooter(
              prompt: l10n.loginCreatePrompt,
              actionLabel: l10n.loginCreateAccount,
              onAction: () => Get.toNamed(AppRoutes.register),
            ),
          ),
        ],
      ),
    );
  }
}
