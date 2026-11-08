import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/features/profile/domain/entities/user_profile.dart';
import 'package:owezy_mobile/features/profile/domain/repositories/profile_repository.dart';
import 'package:owezy_mobile/features/profile/domain/usecases/get_profile_usecase.dart';
import 'package:owezy_mobile/features/profile/domain/usecases/update_profile_usecase.dart';
import 'package:owezy_mobile/features/profile/presentation/controllers/profile_controller.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

class _FakeRepo implements ProfileRepository {
  UpdateProfileParams? lastUpdate;

  @override
  Future<UserProfile> getMe() async => const UserProfile(
        id: '1',
        email: 'alex@example.com',
        fullName: 'Alex',
        role: 'user',
        emailVerified: true,
        defaultCurrency: 'USD',
      );

  @override
  Future<UserProfile> updateMe(UpdateProfileParams params) async {
    lastUpdate = params;
    return UserProfile(
      id: '1',
      email: 'alex@example.com',
      fullName: params.fullName ?? 'Alex',
      role: 'user',
      emailVerified: true,
      defaultCurrency: params.defaultCurrency ?? 'USD',
      preferredLocale: params.preferredLocale ?? 'en',
    );
  }
}

void main() {
  late AppLocalizations l10n;

  setUpAll(() async {
    l10n = await AppLocalizations.delegate.load(const Locale('en'));
  });

  setUp(() => Get.testMode = true);
  tearDown(Get.reset);

  test('save with empty name sets field error', () async {
    final repo = _FakeRepo();
    final controller = ProfileController(
      GetProfileUseCase(repo),
      UpdateProfileUseCase(repo),
    );
    controller.isLoading.value = false;
    controller.fullName.value = '';
    await controller.save(l10n);
    expect(controller.fieldErrors['fullName'], isNotNull);
    expect(repo.lastUpdate, isNull);
  });

  test('save updates profile', () async {
    final repo = _FakeRepo();
    final controller = ProfileController(
      GetProfileUseCase(repo),
      UpdateProfileUseCase(repo),
    );
    controller.isLoading.value = false;
    controller.fullName.value = 'Alex Morgan';
    controller.defaultCurrency.value = 'EUR';
    await controller.save(l10n);
    expect(repo.lastUpdate?.fullName, 'Alex Morgan');
    expect(repo.lastUpdate?.defaultCurrency, 'EUR');
    expect(controller.successMessage.value, isNotNull);
  });
}
