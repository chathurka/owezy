import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/features/auth/domain/entities/auth_session.dart';
import 'package:owezy_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/forgot_password_usecase.dart';
import 'package:owezy_mobile/features/auth/presentation/controllers/forgot_password_controller.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

// ── Fake repository stubs ────────────────────────────────────────────────────

class _SuccessRepo extends _BaseRepo {
  int forgotCallCount = 0;

  @override
  Future<void> forgotPassword(ForgotPasswordParams params) async {
    forgotCallCount += 1;
  }
}

class _FailRepo extends _BaseRepo {
  @override
  Future<void> forgotPassword(ForgotPasswordParams params) async {
    throw Exception('network error');
  }
}

abstract class _BaseRepo implements AuthRepository {
  @override
  Future<AuthSession> register(RegisterParams params) =>
      throw UnimplementedError();

  @override
  Future<AuthSession> login(LoginParams params) => throw UnimplementedError();

  @override
  Future<AuthSession> signInWithApple(AppleSignInParams params) =>
      throw UnimplementedError();

  @override
  Future<VerifyEmailResult> verifyEmail(VerifyEmailParams params) =>
      throw UnimplementedError();

  @override
  Future<void> resendVerification(ResendVerificationParams params) async {}

  @override
  Future<void> forgotPassword(ForgotPasswordParams params) async {}

  @override
  Future<void> resetPassword(ResetPasswordParams params) async {}
}

// ── Helpers ──────────────────────────────────────────────────────────────────

ForgotPasswordController _makeController(AuthRepository repo) {
  return ForgotPasswordController(ForgotPasswordUseCase(repo));
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final l10n = lookupAppLocalizations(const Locale('en'));

  setUp(() {
    Get.testMode = true;
  });

  tearDown(() {
    Get.reset();
  });

  group('ForgotPasswordController', () {
    test('validation rejects invalid email', () async {
      final ctrl = _makeController(_SuccessRepo());

      ctrl.email.value = 'not-an-email';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isFalse);
      expect(ctrl.fieldError.value, l10n.forgotPasswordErrorEmail);
    });

    test('valid email calls repository and sets didSucceed', () async {
      final repo = _SuccessRepo();
      final ctrl = _makeController(repo);

      ctrl.email.value = 'alex@example.com';
      await ctrl.submit(l10n);

      expect(repo.forgotCallCount, 1);
      expect(ctrl.didSucceed.value, isTrue);
      expect(ctrl.formError.value, isNull);
    });

    test('sets didSucceed even when repository throws (non-enumerating)',
        () async {
      final ctrl = _makeController(_FailRepo());

      ctrl.email.value = 'alex@example.com';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isTrue);
    });
  });
}
