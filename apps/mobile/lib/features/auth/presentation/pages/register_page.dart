import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_assets.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../controllers/register_controller.dart';
import '../widgets/register_form_field.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Design source: resources/owezy-mobile/prototype/screens/CreateAccount.dc.html
// Frame 390×844 · padding top 56 / sides 24 · white bg
// ─────────────────────────────────────────────────────────────────────────────

class RegisterPage extends GetView<RegisterController> {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Let AppTheme handle scaffold bg — correct in both light and dark.
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

// ─────────────────────────────────────────────────────────────────────────────
// Form view
// ─────────────────────────────────────────────────────────────────────────────

class _FormView extends StatelessWidget {
  const _FormView({required this.controller});

  final RegisterController controller;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Stack(
      children: [
        // Scrollable body — leaves 70px at bottom for the sticky footer
        ListView(
          padding: const EdgeInsets.fromLTRB(24, 56, 24, 80),
          children: [
            // Back button — 44×44, radius 14, #F4F3FA bg
            GestureDetector(
              onTap: () => Get.toNamed(AppRoutes.login),
              child: Builder(builder: (context) => Container(
                width: AppSpacing.touchMin,
                height: AppSpacing.touchMin,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: context.appSubtle,
                  borderRadius: const BorderRadius.all(Radius.circular(AppRadius.md)),
                ),
                child: Icon(
                  Icons.chevron_left,
                  size: 22,
                  color: context.appText,
                ),
              )),
            ),
            const SizedBox(height: 16),

            // Title + subtitle
            Text(
              l10n.registerTitle,
              style: AppTextStyles.title,
            ),
            const SizedBox(height: 6),
            Text(
              l10n.registerSubtitle,
              style: AppTextStyles.body.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: context.appTextMuted,
              ),
            ),
            const SizedBox(height: 16),

            // Social buttons — stacked, Apple first
            Obx(
              () => _SocialButton(
                label: l10n.registerContinueApple,
                isApple: true,
                onPressed: controller.isSubmitting.value
                    ? null
                    : () => controller.continueWithApple(l10n),
              ),
            ),
            const SizedBox(height: 10),
            Obx(
              () => _SocialButton(
                label: l10n.registerContinueGoogle,
                isApple: false,
                onPressed: controller.isSubmitting.value
                    ? null
                    : () => controller.continueWithGoogle(l10n),
              ),
            ),
            const SizedBox(height: 16),

            // Divider
            _OrDivider(label: l10n.registerOrEmail),
            const SizedBox(height: 16),

            // Fields
            Obx(
              () => RegisterFormField(
                label: l10n.registerFullNameLabel,
                placeholder: l10n.registerFullNamePlaceholder,
                iconAsset: AppAssets.iconUser,
                errorText: controller.fieldErrors['fullName'],
                onChanged: (v) => controller.fullName.value = v,
              ),
            ),
            const SizedBox(height: 12),
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
            const SizedBox(height: 12),
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
                    minimumSize: const Size(34, 34),
                    padding: EdgeInsets.zero,
                  ),
                  icon: SvgPicture.asset(
                    controller.obscurePassword.value
                        ? AppAssets.iconEye
                        : AppAssets.iconEyeOff,
                    width: 20,
                    height: 20,
                    colorFilter: ColorFilter.mode(
                      context.appTextMuted,
                      BlendMode.srcIn,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 2),
            _PasswordStrength(controller: controller, l10n: l10n),
            const SizedBox(height: 16),

            // Form-level error
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

            // Primary CTA — via AppButton from core/widgets (theme-aware)
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

        // Sticky "Already have an account?" footer
        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: Builder(builder: (context) => Container(
            padding: const EdgeInsets.fromLTRB(24, 14, 24, 30),
            decoration: BoxDecoration(color: context.appSurface),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '${l10n.registerSignInPrompt} ',
                  style: AppTextStyles.body.copyWith(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: context.appTextMuted,
                  ),
                ),
                GestureDetector(
                  onTap: () => Get.toNamed(AppRoutes.login),
                  child: Text(
                    l10n.registerSignIn,
                    style: AppTextStyles.bodyStrong.copyWith(
                      fontSize: 14,
                      color: context.appText,
                    ),
                  ),
                ),
              ],
            ),
          )),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Password strength meter (4 segments + label)
// ─────────────────────────────────────────────────────────────────────────────

class _PasswordStrength extends StatelessWidget {
  const _PasswordStrength({required this.controller, required this.l10n});

  final RegisterController controller;
  final AppLocalizations l10n;

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final pw = controller.password.value;
      final score = controller.passwordStrengthScore;
      return Builder(builder: (context) {
        final color = _color(context, pw, score);
        return Padding(
          padding: const EdgeInsets.only(top: 2, left: 2, right: 2),
          child: Row(
            children: [
              // 4 segments
              ...List.generate(4, (i) {
                final on = i < score;
                return Expanded(
                  child: Container(
                    height: 4,
                    margin: EdgeInsets.only(right: i < 3 ? 8 : 0),
                    decoration: BoxDecoration(
                      color: on ? color : context.appTrack,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                );
              }),
              const SizedBox(width: 8),
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

// ─────────────────────────────────────────────────────────────────────────────
// Social button — 52h, radius 16, border #E4E3EE
// ─────────────────────────────────────────────────────────────────────────────

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
      height: 52,
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
            _SocialBadge(isApple: isApple),
            const SizedBox(width: 10),
            Text(
              label,
              style: AppTextStyles.bodyStrong.copyWith(
                color: context.appText,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SocialBadge extends StatelessWidget {
  const _SocialBadge({required this.isApple});

  final bool isApple;

  @override
  Widget build(BuildContext context) {
    if (isApple) {
      return Builder(builder: (context) => Container(
        width: 22,
        height: 22,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: context.appText,
          borderRadius: const BorderRadius.all(Radius.circular(7)),
        ),
        child: Text(
          '',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: context.appSurface,
            height: 1,
          ),
        ),
      ));
    }
    return Builder(builder: (context) => Container(
      width: 22,
      height: 22,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: context.appSurface,
        borderRadius: const BorderRadius.all(Radius.circular(11)),
        border: Border.all(color: context.appBorderStrong, width: 1.5),
      ),
      child: Text(
        'G',
        style: AppTextStyles.label.copyWith(
          fontWeight: FontWeight.w800,
          color: context.appTextMuted,
          fontSize: 13,
        ),
      ),
    ));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Or divider
// ─────────────────────────────────────────────────────────────────────────────

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

// _PrimaryButton removed — callers now use AppButton from core/widgets.

// ─────────────────────────────────────────────────────────────────────────────
// Success / check-inbox view
// ─────────────────────────────────────────────────────────────────────────────

class _SuccessView extends StatelessWidget {
  const _SuccessView({required this.controller});

  final RegisterController controller;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return ListView(
      padding: const EdgeInsets.fromLTRB(24, AppSpacing.s8, 24, 32),
      children: [
        const SizedBox(height: AppSpacing.s8),
        Center(
          child: Container(
            width: 72,
            height: 72,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: context.appPrimarySoft,
              borderRadius: AppRadius.contentCard,
            ),
            child: SvgPicture.asset(
              AppAssets.iconMail,
              width: 34,
              height: 34,
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
        const SizedBox(height: 8),
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
            width: 26,
            height: 26,
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
          const SizedBox(width: 12),
          Expanded(
            child: Text(label, style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }
}
