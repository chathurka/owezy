import 'package:flutter/material.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:owezy_mobile/features/auth/domain/apple_auth_gateway.dart';
import 'package:owezy_mobile/features/auth/domain/entities/auth_session.dart';
import 'package:owezy_mobile/features/auth/domain/google_auth_gateway.dart';
import 'package:owezy_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/register_usecase.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/sign_in_with_apple_usecase.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/sign_in_with_google_usecase.dart';
import 'package:owezy_mobile/features/auth/presentation/controllers/register_controller.dart';

class _FakeAuthRepository implements AuthRepository {
  _FakeAuthRepository({this.onRegister});

  Future<AuthSession> Function(RegisterParams params)? onRegister;
  int callCount = 0;

  @override
  Future<AuthSession> register(RegisterParams params) async {
    callCount += 1;
    if (onRegister != null) return onRegister!(params);
    return AuthSession(
      accessToken: 'access',
      refreshToken: 'refresh',
      emailVerificationRequired: true,
      user: AuthUser(
        id: '11111111-1111-4111-8111-111111111111',
        email: params.email,
        fullName: params.fullName,
        role: 'user',
        emailVerified: false,
        defaultCurrency: params.defaultCurrency,
      ),
    );
  }

  @override
  Future<AuthSession> login(LoginParams params) {
    throw UnimplementedError();
  }

  @override
  Future<AuthSession> signInWithApple(AppleSignInParams params) {
    throw UnimplementedError();
  }

  @override
  Future<AuthSession> signInWithGoogle(GoogleSignInParams params) {
    throw UnimplementedError();
  }

  @override
  Future<VerifyEmailResult> verifyEmail(VerifyEmailParams params) {
    throw UnimplementedError();
  }

  @override
  Future<void> resendVerification(ResendVerificationParams params) {
    throw UnimplementedError();
  }

  @override
  Future<void> forgotPassword(ForgotPasswordParams params) {
    throw UnimplementedError();
  }

  @override
  Future<void> resetPassword(ResetPasswordParams params) {
    throw UnimplementedError();
  }
}

class _FakeAppleAuthGateway implements AppleAuthGateway {
  @override
  Future<AppleCredential?> requestCredential() async => null;
}

class _FakeGoogleAuthGateway implements GoogleAuthGateway {
  @override
  Future<GoogleCredential?> requestCredential() async => null;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final l10n = lookupAppLocalizations(const Locale('en'));

  group('RegisterController', () {
    test('validation failure does not call repository', () async {
      final repo = _FakeAuthRepository();
      final controller = RegisterController(
        RegisterUseCase(repo),
        SignInWithAppleUseCase(_FakeAppleAuthGateway(), repo),
        SignInWithGoogleUseCase(_FakeGoogleAuthGateway(), repo),
      );
      controller.onInit();

      await controller.submit(l10n);

      expect(controller.fieldErrors.isNotEmpty, isTrue);
      expect(repo.callCount, 0);
      expect(controller.didSucceed.value, isFalse);
    });

    test('valid submit calls use case and sets success state', () async {
      final repo = _FakeAuthRepository();
      final controller = RegisterController(
        RegisterUseCase(repo),
        SignInWithAppleUseCase(_FakeAppleAuthGateway(), repo),
        SignInWithGoogleUseCase(_FakeGoogleAuthGateway(), repo),
      );
      controller.onInit();

      controller.fullName.value = 'Alex Morgan';
      controller.email.value = 'alex@example.com';
      controller.password.value = 'Lisbon2026';

      await controller.submit(l10n);

      expect(repo.callCount, 1);
      expect(controller.didSucceed.value, isTrue);
      expect(controller.registeredEmail.value, 'alex@example.com');
    });
  });
}
