import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/features/profile/domain/entities/user_profile.dart';
import 'package:owezy_mobile/features/profile/domain/repositories/profile_repository.dart';
import 'package:owezy_mobile/features/profile/domain/usecases/get_profile_usecase.dart';
import 'package:owezy_mobile/features/profile/domain/usecases/update_profile_usecase.dart';
import 'package:owezy_mobile/features/profile/presentation/controllers/profile_setup_controller.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';
import 'package:flutter/material.dart';

class _FakeProfileRepository implements ProfileRepository {
  _FakeProfileRepository({this.profile, this.onUpdate});

  UserProfile? profile;
  Future<UserProfile> Function(UpdateProfileParams params)? onUpdate;
  UpdateProfileParams? lastUpdate;

  @override
  Future<UserProfile> getMe() async {
    return profile ??
        const UserProfile(
          id: '11111111-1111-4111-8111-111111111111',
          email: 'alex@example.com',
          fullName: 'Alex',
          role: 'user',
          emailVerified: true,
          defaultCurrency: 'USD',
        );
  }

  @override
  Future<UserProfile> updateMe(UpdateProfileParams params) async {
    lastUpdate = params;
    if (onUpdate != null) return onUpdate!(params);
    return UserProfile(
      id: '11111111-1111-4111-8111-111111111111',
      email: 'alex@example.com',
      fullName: params.fullName ?? 'Alex',
      role: 'user',
      emailVerified: true,
      defaultCurrency: 'USD',
      phone: params.phone,
      paymentHandle: params.paymentHandle,
      profileSetupCompletedAt: DateTime.parse('2026-11-08T12:00:00.000Z'),
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late AppLocalizations l10n;

  setUpAll(() async {
    l10n = await AppLocalizations.delegate.load(const Locale('en'));
  });

  setUp(() {
    Get.testMode = true;
  });

  tearDown(Get.reset);

  test('empty name shows validation error without calling update', () async {
    final repo = _FakeProfileRepository();
    final controller = ProfileSetupController(
      GetProfileUseCase(repo),
      UpdateProfileUseCase(repo),
    );
    controller.onInit();
    await Future<void>.delayed(Duration.zero);

    controller.fullName.value = '   ';
    await controller.submit(l10n);

    expect(controller.fieldErrors['fullName'], isNotNull);
    expect(repo.lastUpdate, isNull);
  });

  test('valid name completes setup', () async {
    final repo = _FakeProfileRepository();
    final controller = ProfileSetupController(
      GetProfileUseCase(repo),
      UpdateProfileUseCase(repo),
    );
    // Avoid onInit navigation side effects in unit test by setting fields directly.
    controller.isLoading.value = false;
    controller.fullName.value = 'Alex Morgan';

    await controller.submit(l10n);

    expect(repo.lastUpdate?.fullName, 'Alex Morgan');
    expect(repo.lastUpdate?.completeSetup, isTrue);
  });
}
