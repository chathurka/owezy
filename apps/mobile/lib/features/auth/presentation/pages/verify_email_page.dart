import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../controllers/verify_email_controller.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Design source: resources/owezy-mobile/prototype/screens/VerifyEmail.dc.html
// Frame 390×844 · padding top 56 / sides 24
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Form view
// ─────────────────────────────────────────────────────────────────────────────

class _FormView extends StatelessWidget {
  const _FormView({required this.controller});

  final VerifyEmailController controller;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Stack(
      children: [
        ListView(
          padding: const EdgeInsets.fromLTRB(24, 56, 24, 80),
          children: [
            // Back chevron
            GestureDetector(
              onTap: () => Get.back(),
              child: Builder(
                builder: (context) => Container(
                  width: AppSpacing.touchMin,
                  height: AppSpacing.touchMin,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: context.appSubtle,
                    borderRadius:
                        const BorderRadius.all(Radius.circular(AppRadius.md)),
                  ),
                  child: Icon(
                    Icons.chevron_left,
                    size: 22,
                    color: context.appText,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Title + subtitle
            Text(l10n.verifyEmailTitle, style: AppTextStyles.title),
            const SizedBox(height: 6),
            Text(
              l10n.verifyEmailSubtitle,
              style: AppTextStyles.body.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: context.appTextMuted,
              ),
            ),
            const SizedBox(height: 32),

            // 6-digit OTP boxes
            _OtpRow(controller: controller, l10n: l10n),
            const SizedBox(height: 16),

            // Field error
            Obx(() {
              final err = controller.fieldError.value;
              if (err == null) return const SizedBox.shrink();
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(
                  err,
                  style: AppTextStyles.caption
                      .copyWith(color: AppColors.error, fontWeight: FontWeight.w600),
                ),
              );
            }),

            // Form-level error
            Obx(() {
              final err = controller.formError.value;
              if (err == null) return const SizedBox.shrink();
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(
                  err,
                  style: AppTextStyles.caption
                      .copyWith(color: AppColors.error, fontWeight: FontWeight.w600),
                ),
              );
            }),

            // Resend message
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

            // Verify CTA
            Obx(
              () => AppButton(
                label: controller.isSubmitting.value
                    ? l10n.verifyEmailSubmitting
                    : l10n.verifyEmailSubmit,
                onPressed: controller.isSubmitting.value
                    ? null
                    : () => controller.submit(l10n),
                isLoading: controller.isSubmitting.value,
              ),
            ),
            const SizedBox(height: 20),

            // Resend row
            Obx(
              () => Center(
                child: controller.resendCooldown.value > 0
                    ? Text(
                        l10n.verifyEmailResendCooldown(
                            controller.resendCooldown.value),
                        style: AppTextStyles.caption.copyWith(
                          color: context.appTextMuted,
                        ),
                      )
                    : GestureDetector(
                        onTap: () => controller.resend(l10n),
                        child: Text(
                          l10n.verifyEmailResend,
                          style: AppTextStyles.caption.copyWith(
                            color: context.appPrimary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6-digit OTP input row
// ─────────────────────────────────────────────────────────────────────────────

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
  void dispose() {
    for (final c in _tecs) {
      c.dispose();
    }
    for (final f in _fns) {
      f.dispose();
    }
    super.dispose();
  }

  void _onChanged(int index, String value) {
    if (value.length > 1) {
      // Handle paste: distribute digits across boxes
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
    widget.controller.code.value =
        _tecs.map((c) => c.text).join();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(6, (i) {
        return SizedBox(
          width: 48,
          height: 56,
          child: Obx(() {
            final hasError = widget.controller.fieldError.value != null;
            return TextField(
              controller: _tecs[i],
              focusNode: _fns[i],
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(6),
              ],
              textAlign: TextAlign.center,
              style: AppTextStyles.title.copyWith(fontSize: 22),
              decoration: InputDecoration(
                counterText: '',
                contentPadding: EdgeInsets.zero,
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  borderSide: BorderSide(
                    color: hasError
                        ? AppColors.error
                        : context.appBorderStrong,
                    width: 1.5,
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  borderSide: BorderSide(
                    color: context.appPrimary,
                    width: 2,
                  ),
                ),
              ),
              onChanged: (v) => _onChanged(i, v),
            );
          }),
        );
      }),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Success view
// ─────────────────────────────────────────────────────────────────────────────

class _SuccessView extends StatelessWidget {
  const _SuccessView({required this.controller});

  final VerifyEmailController controller;

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
            child: Icon(
              Icons.check_rounded,
              size: 36,
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
        const SizedBox(height: 8),
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
