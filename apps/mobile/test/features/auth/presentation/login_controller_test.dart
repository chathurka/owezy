import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/features/auth/domain/apple_auth_gateway.dart';
import 'package:owezy_mobile/features/auth/domain/entities/auth_session.dart';
import 'package:owezy_mobile/features/auth/domain/google_auth_gateway.dart';
import 'package:owezy_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/login_usecase.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/sign_in_with_apple_usecase.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/sign_in_with_google_usecase.dart';
import 'package:owezy_mobile/features/auth/presentation/controllers/login_controller.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

class _FakeAuthRepository implements AuthRepository {
  _FakeAuthRepository({this.onLogin, this.onApple, this.onGoogle});

  Future<AuthSession> Function(LoginParams params)? onLogin;
  Future<AuthSession> Function(AppleSignInParams params)? onApple;
  Future<AuthSession> Function(GoogleSignInParams params)? onGoogle;
  int loginCallCount = 0;
  int appleCallCount = 0;
  int googleCallCount = 0;

  @override
  Future<AuthSession> register(RegisterParams params) {
    throw UnimplementedError();
  }

  @override
  Future<AuthSession> login(LoginParams params) async {
    loginCallCount += 1;
    if (onLogin != null) return onLogin!(params);
    return AuthSession(
      accessToken: 'access',
      refreshToken: 'refresh',
      emailVerificationRequired: false,
      user: AuthUser(
        id: '11111111-1111-4111-8111-111111111111',
        email: params.email,
        fullName: 'Alex Morgan',
        role: 'user',
        emailVerified: true,
        defaultCurrency: 'USD',
      ),
    );
  }

  @override
  Future<AuthSession> signInWithApple(AppleSignInParams params) async {
    appleCallCount += 1;
    if (onApple != null) return onApple!(params);
    return AuthSession(
      accessToken: 'access',
      refreshToken: 'refresh',
      emailVerificationRequired: false,
      user: AuthUser(
        id: '11111111-1111-4111-8111-111111111111',
        email: 'relay@privaterelay.appleid.com',
        fullName: 'Alex',
        role: 'user',
        emailVerified: true,
        defaultCurrency: 'USD',
      ),
    );
  }

  @override
  Future<AuthSession> signInWithGoogle(GoogleSignInParams params) async {
    googleCallCount += 1;
    if (onGoogle != null) return onGoogle!(params);
    return AuthSession(
      accessToken: 'access',
      refreshToken: 'refresh',
      emailVerificationRequired: false,
      user: AuthUser(
        id: '11111111-1111-4111-8111-111111111111',
        email: 'alex@example.com',
        fullName: 'Alex',
        role: 'user',
        emailVerified: true,
        defaultCurrency: 'USD',
      ),
    );
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
  _FakeAppleAuthGateway({this.credential});

  final AppleCredential? credential;

  @override
  Future<AppleCredential?> requestCredential() async => credential;
}

class _FakeGoogleAuthGateway implements GoogleAuthGateway {
  _FakeGoogleAuthGateway({this.credential});

  final GoogleCredential? credential;

  @override
  Future<GoogleCredential?> requestCredential() async => credential;
}

LoginController _buildController(_FakeAuthRepository repo) {
  return LoginController(
    LoginUseCase(repo),
    SignInWithAppleUseCase(_FakeAppleAuthGateway(), repo),
    SignInWithGoogleUseCase(_FakeGoogleAuthGateway(), repo),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final l10n = lookupAppLocalizations(const Locale('en'));

  setUp(() {
    Get.testMode = true;
    Get.reset();
  });

  tearDown(Get.reset);

  group('LoginController', () {
    test('validation failure does not call repository', () async {
      final repo = _FakeAuthRepository();
      final controller = _buildController(repo);

      await controller.submit(l10n);

      expect(controller.fieldErrors.isNotEmpty, isTrue);
      expect(repo.loginCallCount, 0);
    });

    test('valid submit calls use case', () async {
      final repo = _FakeAuthRepository();
      final controller = _buildController(repo);

      controller.email.value = 'alex@example.com';
      controller.password.value = 'Lisbon2026';

      Object? navigationError;
      try {
        await controller.submit(l10n);
      } catch (error) {
        // GetX navigation may throw outside a GetMaterialApp.
        navigationError = error;
      }

      expect(repo.loginCallCount, 1);
      expect(controller.formError.value, isNull);
      expect(navigationError, isNotNull);
    });

    test('auth failure sets form error', () async {
      final repo = _FakeAuthRepository(
        onLogin: (_) async {
          throw Exception('network');
        },
      );
      final controller = _buildController(repo);

      controller.email.value = 'alex@example.com';
      controller.password.value = 'Lisbon2026';

      await controller.submit(l10n);

      expect(repo.loginCallCount, 1);
      expect(controller.formError.value, l10n.loginErrorGeneric);
    });

    test('Apple success stores session path via repository', () async {
      final repo = _FakeAuthRepository();
      final controller = LoginController(
        LoginUseCase(repo),
        SignInWithAppleUseCase(
          _FakeAppleAuthGateway(
            credential: const AppleCredential(identityToken: 'apple.jwt'),
          ),
          repo,
        ),
        SignInWithGoogleUseCase(_FakeGoogleAuthGateway(), repo),
      );

      Object? navigationError;
      try {
        await controller.continueWithApple(l10n);
      } catch (error) {
        navigationError = error;
      }

      expect(repo.appleCallCount, 1);
      expect(controller.formError.value, isNull);
      expect(navigationError, isNotNull);
    });

    test('Apple cancel leaves unauthenticated without repository call', () async {
      final repo = _FakeAuthRepository();
      final controller = _buildController(repo);

      await controller.continueWithApple(l10n);

      expect(repo.appleCallCount, 0);
      expect(controller.formError.value, l10n.loginAppleCancelled);
    });

    test('Google success stores session path via repository', () async {
      final repo = _FakeAuthRepository();
      final controller = LoginController(
        LoginUseCase(repo),
        SignInWithAppleUseCase(_FakeAppleAuthGateway(), repo),
        SignInWithGoogleUseCase(
          _FakeGoogleAuthGateway(
            credential: const GoogleCredential(idToken: 'google.jwt'),
          ),
          repo,
        ),
      );

      Object? navigationError;
      try {
        await controller.continueWithGoogle(l10n);
      } catch (error) {
        navigationError = error;
      }

      expect(repo.googleCallCount, 1);
      expect(controller.formError.value, isNull);
      expect(navigationError, isNotNull);
    });

    test('Google cancel leaves unauthenticated without repository call', () async {
      final repo = _FakeAuthRepository();
      final controller = _buildController(repo);

      await controller.continueWithGoogle(l10n);

      expect(repo.googleCallCount, 0);
      expect(controller.formError.value, l10n.loginGoogleCancelled);
    });
  });
}
