import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/features/auth/domain/entities/auth_session.dart';
import 'package:owezy_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/login_usecase.dart';
import 'package:owezy_mobile/features/auth/presentation/controllers/login_controller.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

class _FakeAuthRepository implements AuthRepository {
  _FakeAuthRepository({this.onLogin});

  Future<AuthSession> Function(LoginParams params)? onLogin;
  int loginCallCount = 0;

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
      final controller = LoginController(LoginUseCase(repo));

      await controller.submit(l10n);

      expect(controller.fieldErrors.isNotEmpty, isTrue);
      expect(repo.loginCallCount, 0);
    });

    test('valid submit calls use case', () async {
      final repo = _FakeAuthRepository();
      final controller = LoginController(LoginUseCase(repo));

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
      final controller = LoginController(LoginUseCase(repo));

      controller.email.value = 'alex@example.com';
      controller.password.value = 'Lisbon2026';

      await controller.submit(l10n);

      expect(repo.loginCallCount, 1);
      expect(controller.formError.value, l10n.loginErrorGeneric);
    });
  });
}
