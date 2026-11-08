import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/core/errors/api_exception.dart';
import 'package:owezy_mobile/features/auth/domain/entities/auth_session.dart';
import 'package:owezy_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/verify_email_usecase.dart';
import 'package:owezy_mobile/features/auth/presentation/controllers/verify_email_controller.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

// ── Fake repository stubs ────────────────────────────────────────────────────

class _AlwaysValidRepo extends _BaseRepo {
  @override
  Future<VerifyEmailResult> verifyEmail(VerifyEmailParams params) async {
    return const VerifyEmailResult(
        email: 'alex@example.com', emailVerified: true);
  }
}

class _AlwaysInvalidRepo extends _BaseRepo {
  @override
  Future<VerifyEmailResult> verifyEmail(VerifyEmailParams params) async {
    throw const ApiException(
      title: 'VERIFICATION_TOKEN_INVALID',
      message: 'Invalid token',
      statusCode: 400,
    );
  }
}

class _ResendRepo extends _BaseRepo {
  int resendCallCount = 0;

  @override
  Future<void> resendVerification(ResendVerificationParams params) async {
    resendCallCount += 1;
  }
}

// Base with unimplemented stubs
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
  Future<void> forgotPassword(ForgotPasswordParams params) =>
      throw UnimplementedError();

  @override
  Future<void> resetPassword(ResetPasswordParams params) =>
      throw UnimplementedError();
}

// ── Helpers ──────────────────────────────────────────────────────────────────

VerifyEmailController _makeController(AuthRepository repo) {
  return VerifyEmailController(
    VerifyEmailUseCase(repo),
    ResendVerificationUseCase(repo),
  );
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

  group('VerifyEmailController', () {
    test('validation rejects non-6-digit code', () async {
      final ctrl = _makeController(_AlwaysValidRepo());

      ctrl.code.value = '12345'; // only 5 digits
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isFalse);
      expect(ctrl.fieldError.value, isNotNull);
    });

    test('valid code sets didSucceed on success', () async {
      final ctrl = _makeController(_AlwaysValidRepo());

      ctrl.code.value = '123456';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isTrue);
      expect(ctrl.formError.value, isNull);
    });

    test('VERIFICATION_TOKEN_INVALID sets invalid formError', () async {
      final ctrl = _makeController(_AlwaysInvalidRepo());

      ctrl.code.value = '999999';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isFalse);
      expect(ctrl.formError.value, l10n.verifyEmailErrorInvalid);
    });

    test('resend calls repository and starts cooldown', () async {
      final repo = _ResendRepo();
      final ctrl = _makeController(repo);
      ctrl.email = 'alex@example.com';

      await ctrl.resend(l10n);

      expect(repo.resendCallCount, 1);
      expect(ctrl.resendCooldown.value, greaterThan(0));
      ctrl.onClose(); // cancel timer
    });

    test('resend within cooldown does not call repository again', () async {
      final repo = _ResendRepo();
      final ctrl = _makeController(repo);
      ctrl.email = 'alex@example.com';

      await ctrl.resend(l10n); // first call, starts cooldown
      await ctrl.resend(l10n); // second call, within cooldown → ignored

      expect(repo.resendCallCount, 1);
      ctrl.onClose();
    });
  });
}
