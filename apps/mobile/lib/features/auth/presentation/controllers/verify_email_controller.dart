import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

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

  /// Optional email to enable resend / subtitle; from route params or arguments.
  String? email;

  Timer? _cooldownTimer;

  bool get hasCompleteCode => RegExp(r'^\d{6}$').hasMatch(code.value.trim());

  String get displayEmail {
    final value = email?.trim();
    if (value != null && value.isNotEmpty) return value;
    return '—';
  }

  String get formattedResendCooldown {
    final secs = resendCooldown.value.clamp(0, _kResendCooldownSecs);
    final minutes = secs ~/ 60;
    final seconds = secs % 60;
    return '$minutes:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  void onInit() {
    super.onInit();
    final paramEmail = Get.parameters['email'];
    final argEmail = Get.arguments;
    email = (paramEmail != null && paramEmail.isNotEmpty)
        ? paramEmail
        : (argEmail is String && argEmail.isNotEmpty ? argEmail : null);
    _startCooldown();
  }

  @override
  void onClose() {
    _cooldownTimer?.cancel();
    super.onClose();
  }

  bool _validate(AppLocalizations l10n) {
    if (!hasCompleteCode) {
      fieldError.value = l10n.verifyEmailErrorInvalidCode;
      return false;
    }
    fieldError.value = null;
    return true;
  }

  Future<void> submit(AppLocalizations l10n) async {
    formError.value = null;
    if (!_validate(l10n)) return;

    isSubmitting.value = true;
    try {
      await _verifyEmail(code.value.trim());
      didSucceed.value = true;
    } on ApiException catch (e) {
      formError.value = e.statusCode == 400
          ? l10n.verifyEmailErrorInvalid
          : l10n.verifyEmailErrorGeneric;
    } catch (_) {
      formError.value = l10n.verifyEmailErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }

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

  void changeEmail() {
    final context = Get.context;
    if (context != null && Navigator.of(context).canPop()) {
      Get.back<void>();
      return;
    }
    Get.offAllNamed(AppRoutes.register);
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

  void continueToHome() => Get.offAllNamed(AppRoutes.profileSetup);
}
