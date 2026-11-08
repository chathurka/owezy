import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
import '../controllers/verify_email_controller.dart';
import '../widgets/auth_chrome.dart';

// Design source: Figma Owezy Mobile — Verify email node 1:4743
// https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-4743
// Frame 390×844 · padding top 56 / sides 24 · OTP + resend + verify + change email

class VerifyEmailPage extends GetView<VerifyEmailController> {
  const VerifyEmailPage({super.key});

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

  final VerifyEmailController controller;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return ListView(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.s6,
        AppSpacing.safeTop,
        AppSpacing.s6,
        AppSpacing.s8,
      ),
      children: [
        AuthBackButton(
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Get.back<void>();
            } else {
              Get.offAllNamed(AppRoutes.register);
            }
          },
        ),
        const SizedBox(height: AppDimensions.size20),
        Container(
          width: AppDimensions.size60,
          height: AppDimensions.size60,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: context.appPrimarySoft,
            borderRadius: const BorderRadius.all(Radius.circular(AppRadius.r2xl)),
          ),
          child: SvgPicture.asset(
            AppAssets.iconMail,
            width: AppDimensions.size28,
            height: AppDimensions.size28,
            colorFilter: ColorFilter.mode(
              context.appPrimary,
              BlendMode.srcIn,
            ),
          ),
        ),
        const SizedBox(height: AppDimensions.size12),
        Text(l10n.verifyEmailTitle, style: AppTextStyles.title),
        const SizedBox(height: AppDimensions.size6),
        Text.rich(
          TextSpan(
            text: '${l10n.verifyEmailSubtitlePrefix}\n',
            style: AppTextStyles.body.copyWith(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: context.appTextMuted,
              height: 20.3 / 14,
            ),
            children: [
              TextSpan(
                text: controller.displayEmail,
                style: AppTextStyles.bodyStrong.copyWith(
                  fontSize: 14,
                  color: context.appText,
                  height: 20.3 / 14,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppDimensions.size20),
        _OtpRow(controller: controller, l10n: l10n),
        const SizedBox(height: AppDimensions.size16),
        Obx(() {
          final err = controller.fieldError.value ?? controller.formError.value;
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
        Obx(() {
          final msg = controller.resendMessage.value;
          if (msg == null) return const SizedBox.shrink();
          return Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(
              msg,
              style: AppTextStyles.caption.copyWith(
                color: context.appOwed,
                fontWeight: FontWeight.w600,
              ),
            ),
          );
        }),
        Obx(() {
          final cooling = controller.resendCooldown.value > 0;
          return Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                l10n.verifyEmailDidntGetCode,
                style: AppTextStyles.body.copyWith(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: context.appTextMuted,
                ),
              ),
              const SizedBox(width: AppDimensions.size6),
              if (cooling)
                Text(
                  l10n.verifyEmailResendCooldown(
                    controller.formattedResendCooldown,
                  ),
                  style: AppTextStyles.body.copyWith(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: context.appTextMuted.withValues(alpha: 0.72),
                  ),
                )
              else
                GestureDetector(
                  onTap: () => controller.resend(l10n),
                  child: Text(
                    l10n.verifyEmailResend,
                    style: AppTextStyles.body.copyWith(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: context.appPrimary,
                      decoration: TextDecoration.underline,
                      decorationColor: context.appPrimary,
                    ),
                  ),
                ),
            ],
          );
        }),
        const SizedBox(height: AppDimensions.size20),
        Obx(
          () => AppButton(
            label: controller.isSubmitting.value
                ? l10n.verifyEmailSubmitting
                : l10n.verifyEmailSubmit,
            onPressed: controller.isSubmitting.value ||
                    !controller.hasCompleteCode
                ? null
                : () => controller.submit(l10n),
            isLoading: controller.isSubmitting.value,
          ),
        ),
        const SizedBox(height: AppDimensions.size16),
        Center(
          child: Text.rich(
            TextSpan(
              text: '${l10n.verifyEmailWrongAddress} ',
              style: AppTextStyles.label.copyWith(
                color: context.appTextMuted,
                fontWeight: FontWeight.w500,
              ),
              children: [
                WidgetSpan(
                  alignment: PlaceholderAlignment.baseline,
                  baseline: TextBaseline.alphabetic,
                  child: GestureDetector(
                    onTap: controller.changeEmail,
                    child: Text(
                      l10n.verifyEmailChangeEmail,
                      style: AppTextStyles.label.copyWith(
                        fontWeight: FontWeight.w700,
                        color: context.appPrimary,
                        decoration: TextDecoration.underline,
                        decorationColor: context.appPrimary,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _OtpRow extends StatefulWidget {
  const _OtpRow({required this.controller, required this.l10n});

  final VerifyEmailController controller;
  final AppLocalizations l10n;

  @override
  State<_OtpRow> createState() => _OtpRowState();
}

class _OtpRowState extends State<_OtpRow> {
  final List<TextEditingController> _tecs =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _fns = List.generate(6, (_) => FocusNode());

  @override
  void initState() {
    super.initState();
    for (final fn in _fns) {
      fn.addListener(_onFocusChanged);
    }
  }

  @override
  void dispose() {
    for (final fn in _fns) {
      fn.removeListener(_onFocusChanged);
      fn.dispose();
    }
    for (final c in _tecs) {
      c.dispose();
    }
    super.dispose();
  }

  void _onFocusChanged() => setState(() {});

  void _onChanged(int index, String value) {
    if (value.length > 1) {
      final digits = value.replaceAll(RegExp(r'\D'), '');
      for (var i = 0; i < 6 && i < digits.length; i++) {
        _tecs[i].text = digits[i];
      }
      final nextFocus = digits.length < 6 ? digits.length : 5;
      _fns[nextFocus].requestFocus();
    } else if (value.isNotEmpty) {
      if (index < 5) _fns[index + 1].requestFocus();
    } else {
      if (index > 0) _fns[index - 1].requestFocus();
    }
    widget.controller.code.value = _tecs.map((c) => c.text).join();
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(6, (i) {
        final filled = _tecs[i].text.isNotEmpty;
        final focused = _fns[i].hasFocus;
        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(right: i < 5 ? AppDimensions.size10 : 0),
            child: SizedBox(
              height: AppDimensions.size60,
              child: Obx(() {
                final hasError = widget.controller.fieldError.value != null;
                final borderColor = hasError
                    ? AppColors.error
                    : (filled || focused)
                        ? context.appPrimary
                        : context.appBorder;
                return TextField(
                  controller: _tecs[i],
                  focusNode: _fns[i],
                  keyboardType: TextInputType.number,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(6),
                  ],
                  textAlign: TextAlign.center,
                  style: AppTextStyles.amount.copyWith(fontSize: 24),
                  cursorColor: context.appPrimary,
                  decoration: InputDecoration(
                    counterText: '',
                    filled: true,
                    fillColor: filled
                        ? context.appPrimarySoft
                        : context.appSubtle,
                    contentPadding: EdgeInsets.zero,
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      borderSide: BorderSide(
                        color: borderColor,
                        width: AppDimensions.size1,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      borderSide: BorderSide(
                        color: context.appPrimary,
                        width: AppDimensions.size1_5,
                      ),
                    ),
                  ),
                  onChanged: (v) => _onChanged(i, v),
                );
              }),
            ),
          ),
        );
      }),
    );
  }
}

class _SuccessView extends StatelessWidget {
  const _SuccessView({required this.controller});

  final VerifyEmailController controller;

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
            child: Icon(
              Icons.check_rounded,
              size: AppDimensions.size36,
              color: context.appAccentText,
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.s6),
        Text(
          l10n.verifyEmailSuccessTitle,
          style: AppTextStyles.title,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppDimensions.size8),
        Text(
          l10n.verifyEmailSuccessBody,
          style: AppTextStyles.body.copyWith(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: context.appTextMuted,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppSpacing.s6),
        AppButton(
          label: l10n.verifyEmailContinue,
          onPressed: controller.continueToHome,
        ),
      ],
    );
  }
}
