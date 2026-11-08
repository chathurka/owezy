import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/core/errors/api_exception.dart';
import 'package:owezy_mobile/features/auth/domain/entities/auth_session.dart';
import 'package:owezy_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/reset_password_usecase.dart';
import 'package:owezy_mobile/features/auth/presentation/controllers/reset_password_controller.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

// ── Fake repository stubs ────────────────────────────────────────────────────

class _SuccessRepo extends _BaseRepo {
  String? lastToken;
  String? lastPassword;

  @override
  Future<void> resetPassword(ResetPasswordParams params) async {
    lastToken = params.token;
    lastPassword = params.password;
  }
}

class _InvalidTokenRepo extends _BaseRepo {
  @override
  Future<void> resetPassword(ResetPasswordParams params) async {
    throw const ApiException(
      title: 'RESET_TOKEN_INVALID',
      message: 'Invalid token',
      statusCode: 400,
    );
  }
}

class _GenericErrorRepo extends _BaseRepo {
  @override
  Future<void> resetPassword(ResetPasswordParams params) async {
    throw Exception('server error');
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
  Future<AuthSession> signInWithGoogle(GoogleSignInParams params) =>
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

ResetPasswordController _makeController(AuthRepository repo) {
  final ctrl = ResetPasswordController(ResetPasswordUseCase(repo));
  ctrl.token = 'test-reset-token-hex';
  return ctrl;
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

  group('ResetPasswordController', () {
    test('validation rejects password too short', () async {
      final ctrl = _makeController(_SuccessRepo());

      ctrl.password.value = 'short';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isFalse);
      expect(ctrl.fieldError.value, l10n.resetPasswordErrorPassword);
    });

    test('validation rejects password without uppercase', () async {
      final ctrl = _makeController(_SuccessRepo());

      ctrl.password.value = 'nouppercase1';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isFalse);
      expect(ctrl.fieldError.value, l10n.resetPasswordErrorPassword);
    });

    test('validation rejects password without digit', () async {
      final ctrl = _makeController(_SuccessRepo());

      ctrl.password.value = 'NoDigitHere';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isFalse);
      expect(ctrl.fieldError.value, l10n.resetPasswordErrorPassword);
    });

    test('valid password calls repository and sets didSucceed', () async {
      final repo = _SuccessRepo();
      final ctrl = _makeController(repo);

      ctrl.password.value = 'NewPass1';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isTrue);
      expect(repo.lastToken, 'test-reset-token-hex');
      expect(repo.lastPassword, 'NewPass1');
    });

    test('invalid token shows invalidToken error', () async {
      final ctrl = _makeController(_InvalidTokenRepo());

      ctrl.password.value = 'NewPass1';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isFalse);
      expect(ctrl.formError.value, l10n.resetPasswordErrorInvalidToken);
    });

    test('generic error shows generic formError', () async {
      final ctrl = _makeController(_GenericErrorRepo());

      ctrl.password.value = 'NewPass1';
      await ctrl.submit(l10n);

      expect(ctrl.didSucceed.value, isFalse);
      expect(ctrl.formError.value, l10n.resetPasswordErrorGeneric);
    });

    test('toggleObscure flips obscurePassword', () {
      final ctrl = _makeController(_SuccessRepo());
      expect(ctrl.obscurePassword.value, isTrue);
      ctrl.toggleObscure();
      expect(ctrl.obscurePassword.value, isFalse);
    });
  });
}
