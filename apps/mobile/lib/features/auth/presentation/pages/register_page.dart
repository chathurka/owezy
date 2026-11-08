import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_assets.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../controllers/register_controller.dart';
import '../widgets/auth_chrome.dart';
import '../widgets/register_form_field.dart';

// Design source: Figma Owezy Mobile — Create account node 1:4605
// https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-4605
// Frame 390×844 · padding top 56 / sides 24 · sticky footer

class RegisterPage extends GetView<RegisterController> {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.appSurface,
      body: Obx(() {
        if (controller.didSucceed.value) {
          return _SuccessView(controller: controller);
        }
        return _FormView(controller: controller);
      }),
    );
  }
}

class _FormView extends StatelessWidget {
  const _FormView({required this.controller});

  final RegisterController controller;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Stack(
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
            const SizedBox(height: AppDimensions.size16),
            Text(l10n.registerTitle, style: AppTextStyles.title),
            const SizedBox(height: AppDimensions.size6),
            Text(
              l10n.registerSubtitle,
              style: AppTextStyles.body.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: context.appTextMuted,
              ),
            ),
            const SizedBox(height: AppDimensions.size16),
            Obx(
              () => AuthSocialButton(
                label: l10n.registerContinueApple,
                isApple: true,
                onPressed: controller.isSubmitting.value
                    ? null
                    : () => controller.continueWithApple(l10n),
              ),
            ),
            const SizedBox(height: AppDimensions.size10),
            Obx(
              () => AuthSocialButton(
                label: l10n.registerContinueGoogle,
                isApple: false,
                onPressed: controller.isSubmitting.value
                    ? null
                    : () => controller.continueWithGoogle(l10n),
              ),
            ),
            const SizedBox(height: AppDimensions.size16),
            AuthOrDivider(label: l10n.registerOrEmail),
            const SizedBox(height: AppDimensions.size16),
            Obx(
              () => RegisterFormField(
                label: l10n.registerFullNameLabel,
                placeholder: l10n.registerFullNamePlaceholder,
                iconAsset: AppAssets.iconUser,
                errorText: controller.fieldErrors['fullName'],
                onChanged: (v) => controller.fullName.value = v,
              ),
            ),
            const SizedBox(height: AppDimensions.size12),
            Obx(
              () => RegisterFormField(
                label: l10n.registerEmailLabel,
                placeholder: l10n.registerEmailPlaceholder,
                iconAsset: AppAssets.iconMail,
                keyboardType: TextInputType.emailAddress,
                errorText: controller.fieldErrors['email'],
                onChanged: (v) => controller.email.value = v,
              ),
            ),
            const SizedBox(height: AppDimensions.size12),
            Obx(
              () => RegisterFormField(
                label: l10n.registerPasswordLabel,
                placeholder: l10n.registerPasswordPlaceholder,
                iconAsset: AppAssets.iconLock,
                obscureText: controller.obscurePassword.value,
                focused: controller.fieldErrors['password'] == null &&
                    controller.password.value.isNotEmpty,
                errorText: controller.fieldErrors['password'],
                onChanged: (v) => controller.password.value = v,
                suffix: IconButton(
                  onPressed: controller.toggleObscure,
                  tooltip: controller.obscurePassword.value
                      ? l10n.registerShowPasswordAria
                      : l10n.registerHidePasswordAria,
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
            const SizedBox(height: AppDimensions.size2),
            _PasswordStrength(controller: controller, l10n: l10n),
            const SizedBox(height: AppDimensions.size16),
            Obx(() {
              final err = controller.formError.value;
              if (err == null) return const SizedBox.shrink();
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(
                  err,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.error,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              );
            }),
            Obx(
              () => AppButton(
                label: controller.isSubmitting.value
                    ? l10n.registerSubmitting
                    : l10n.registerSubmit,
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
            prompt: l10n.registerSignInPrompt,
            actionLabel: l10n.registerSignIn,
            onAction: () => Get.toNamed(AppRoutes.login),
          ),
        ),
      ],
    );
  }
}

class _PasswordStrength extends StatelessWidget {
  const _PasswordStrength({required this.controller, required this.l10n});

  final RegisterController controller;
  final AppLocalizations l10n;

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final pw = controller.password.value;
      final score = controller.passwordStrengthScore;
      final color = _color(context, pw, score);
      return Padding(
        padding: const EdgeInsets.only(top: 2, left: 2, right: 2),
        child: Row(
          children: [
            ...List.generate(4, (i) {
              final on = i < score;
              return Expanded(
                child: Container(
                  height: AppDimensions.size4,
                  margin: EdgeInsets.only(right: i < 3 ? 8 : 0),
                  decoration: BoxDecoration(
                    color: on ? color : context.appTrack,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
            const SizedBox(width: AppDimensions.size8),
            Text(
              controller.passwordStrengthLabel(l10n),
              style: AppTextStyles.micro.copyWith(
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ],
        ),
      );
    });
  }

  Color _color(BuildContext context, String pw, int score) {
    if (pw.isEmpty) return context.appTrack;
    if (score == 0) return context.appDanger;
    if (score == 1) return context.appOwe;
    if (score == 2) return context.appWarningText;
    if (score == 3) return context.appPrimary;
    return context.appOwed;
  }
}

class _SuccessView extends StatelessWidget {
  const _SuccessView({required this.controller});

  final RegisterController controller;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return ListView(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.s6,
        AppSpacing.s8,
        AppSpacing.s6,
        AppSpacing.s8,
      ),
      children: [
        const SizedBox(height: AppSpacing.s8),
        Center(
          child: Container(
            width: AppDimensions.size72,
            height: AppDimensions.size72,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: context.appPrimarySoft,
              borderRadius: AppRadius.contentCard,
            ),
            child: SvgPicture.asset(
              AppAssets.iconMail,
              width: AppDimensions.size34,
              height: AppDimensions.size34,
              colorFilter: ColorFilter.mode(
                context.appAccentText,
                BlendMode.srcIn,
              ),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.s6),
        Text(
          l10n.registerSuccessTitle,
          style: AppTextStyles.title,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppDimensions.size8),
        Obx(
          () => Text.rich(
            TextSpan(
              text: '${l10n.registerSuccessBodyPrefix} ',
              style: AppTextStyles.body.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: context.appTextMuted,
              ),
              children: [
                TextSpan(
                  text: controller.registeredEmail.value,
                  style: AppTextStyles.bodyStrong.copyWith(fontSize: 14),
                ),
              ],
            ),
            textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(height: AppSpacing.s6),
        _StepCard(index: 1, label: l10n.registerStepConfirm),
        const SizedBox(height: AppSpacing.s3),
        _StepCard(index: 2, label: l10n.registerStepGroup),
        const SizedBox(height: AppSpacing.s3),
        _StepCard(index: 3, label: l10n.registerStepInvite),
        const SizedBox(height: AppSpacing.s6),
        AppButton(
          label: l10n.registerContinue,
          onPressed: () => Get.offAllNamed(AppRoutes.home),
        ),
        const SizedBox(height: AppSpacing.s3),
        AppButton(
          label: l10n.registerUseDifferentEmail,
          variant: AppButtonVariant.ghost,
          size: AppButtonSize.compact,
          onPressed: controller.useDifferentEmail,
        ),
      ],
    );
  }
}

class _StepCard extends StatelessWidget {
  const _StepCard({required this.index, required this.label});

  final int index;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: context.appSurface,
        borderRadius: const BorderRadius.all(Radius.circular(AppRadius.lg)),
        border: Border.all(color: context.appBorder),
      ),
      child: Row(
        children: [
          Container(
            width: AppDimensions.size26,
            height: AppDimensions.size26,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: context.appPrimarySoft,
              shape: BoxShape.circle,
            ),
            child: Text(
              '$index',
              style: AppTextStyles.micro.copyWith(
                color: context.appAccentText,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          const SizedBox(width: AppDimensions.size12),
          Expanded(
            child: Text(
              label,
              style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}
