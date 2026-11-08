import 'dart:async';

import 'package:owezy_mobile/l10n/app_localizations.dart';
import 'package:get/get.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/errors/api_exception.dart';
import '../../domain/usecases/verify_email_usecase.dart';

const int _kResendCooldownSecs = 60;

class VerifyEmailController extends GetxController {
  VerifyEmailController(this._verifyEmail, this._resend);

  final VerifyEmailUseCase _verifyEmail;
  final ResendVerificationUseCase _resend;

  final code = ''.obs;
  final isSubmitting = false.obs;
  final didSucceed = false.obs;
  final fieldError = RxnString();
  final formError = RxnString();
  final resendCooldown = 0.obs;
  final resendMessage = RxnString();

  /// Optional email to enable resend; set before entering screen.
  String? email;

  Timer? _cooldownTimer;

  @override
  void onClose() {
    _cooldownTimer?.cancel();
    super.onClose();
  }

  // ── Validation ──────────────────────────────────────────────────────────

  bool _validate(AppLocalizations l10n) {
    if (!RegExp(r'^\d{6}$').hasMatch(code.value.trim())) {
      fieldError.value = l10n.verifyEmailErrorInvalidCode;
      return false;
    }
    fieldError.value = null;
    return true;
  }

  // ── Submit ───────────────────────────────────────────────────────────────

  Future<void> submit(AppLocalizations l10n) async {
    formError.value = null;
    if (!_validate(l10n)) return;

    isSubmitting.value = true;
    try {
      await _verifyEmail(code.value.trim());
      didSucceed.value = true;
    } on ApiException catch (e) {
      // 400 → invalid/expired/consumed token
      formError.value = e.statusCode == 400
          ? l10n.verifyEmailErrorInvalid
          : l10n.verifyEmailErrorGeneric;
    } catch (_) {
      formError.value = l10n.verifyEmailErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }

  // ── Resend ───────────────────────────────────────────────────────────────

  Future<void> resend(AppLocalizations l10n) async {
    if (resendCooldown.value > 0 || email == null) return;
    resendMessage.value = null;

    try {
      await _resend(email!);
      resendMessage.value = l10n.verifyEmailResendSent;
      _startCooldown();
    } catch (_) {
      // Non-enumerating — silent failure is acceptable.
    }
  }

  void _startCooldown() {
    resendCooldown.value = _kResendCooldownSecs;
    _cooldownTimer?.cancel();
    _cooldownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (resendCooldown.value <= 1) {
        resendCooldown.value = 0;
        _cooldownTimer?.cancel();
      } else {
        resendCooldown.value -= 1;
      }
    });
  }

  // ── Success navigation ───────────────────────────────────────────────────

  void continueToHome() => Get.offAllNamed(AppRoutes.home);
}
