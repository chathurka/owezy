import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_assets.dart';
import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_radius.dart';
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
        padding: const EdgeInsets.fromLTRB(24, 56, 24, 32),
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
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
                    fontSize: 22,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(l10n.loginTitle, style: AppTextStyles.title),
                    const SizedBox(height: 4),
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
          const SizedBox(height: 24),
          _SocialButton(label: l10n.loginContinueApple, isApple: true),
          const SizedBox(height: 10),
          _SocialButton(label: l10n.loginContinueGoogle, isApple: false),
          const SizedBox(height: 16),
          _OrDivider(label: l10n.loginOrEmail),
          const SizedBox(height: 16),
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
          const SizedBox(height: 12),
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
                  size: 20,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Obx(
                  () => GestureDetector(
                    onTap: controller.toggleRememberMe,
                    child: Row(
                      children: [
                        Container(
                          width: 20,
                          height: 20,
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
                              width: 1.5,
                            ),
                          ),
                          child: controller.rememberMe.value
                              ? Icon(
                                  Icons.check,
                                  size: 14,
                                  color: context.appOnPrimary,
                                )
                              : null,
                        ),
                        const SizedBox(width: 10),
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
                onPressed: () {},
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
            return Padding(
              padding: const EdgeInsets.only(top: 8, bottom: 4),
              child: Text(
                err,
                style: AppTextStyles.caption.copyWith(color: context.appOwe),
              ),
            );
          }),
          const SizedBox(height: 12),
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
          const SizedBox(height: 20),
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
  const _SocialButton({required this.label, required this.isApple});

  final String label;
  final bool isApple;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 52,
      child: OutlinedButton(
        onPressed: null,
        style: OutlinedButton.styleFrom(
          backgroundColor: context.appSurface,
          disabledForegroundColor: context.appText,
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
              width: 22,
              height: 22,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: isApple ? context.appText : context.appSurface,
                borderRadius: BorderRadius.all(
                  Radius.circular(isApple ? 7 : 11),
                ),
                border: isApple
                    ? null
                    : Border.all(color: context.appBorderStrong, width: 1.5),
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
            const SizedBox(width: 10),
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
