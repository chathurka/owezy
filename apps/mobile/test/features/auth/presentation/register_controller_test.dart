import 'package:flutter/material.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:owezy_mobile/features/auth/domain/entities/auth_session.dart';
import 'package:owezy_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:owezy_mobile/features/auth/domain/usecases/register_usecase.dart';
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
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final l10n = lookupAppLocalizations(const Locale('en'));

  group('RegisterController', () {
    test('validation failure does not call repository', () async {
      final repo = _FakeAuthRepository();
      final controller = RegisterController(RegisterUseCase(repo));
      controller.onInit();

      await controller.submit(l10n);

      expect(controller.fieldErrors.isNotEmpty, isTrue);
      expect(repo.callCount, 0);
      expect(controller.didSucceed.value, isFalse);
    });

    test('valid submit calls use case and sets success state', () async {
      final repo = _FakeAuthRepository();
      final controller = RegisterController(RegisterUseCase(repo));
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
