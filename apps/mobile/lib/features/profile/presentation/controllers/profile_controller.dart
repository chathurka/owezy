import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../core/errors/api_exception.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/usecases/get_profile_usecase.dart';
import '../../domain/usecases/update_profile_usecase.dart';

class ProfileController extends GetxController {
  ProfileController(this._getProfile, this._updateProfile);

  final GetProfileUseCase _getProfile;
  final UpdateProfileUseCase _updateProfile;

  final fullName = ''.obs;
  final email = ''.obs;
  final phone = ''.obs;
  final paymentHandle = ''.obs;
  final defaultCurrency = 'USD'.obs;
  final preferredLocale = 'en'.obs;
  final isLoading = true.obs;
  final isSubmitting = false.obs;
  final isEditing = false.obs;
  final successMessage = RxnString();
  final formError = RxnString();
  final fieldErrors = <String, String>{}.obs;

  @override
  void onInit() {
    super.onInit();
    refreshProfile();
  }

  Future<void> refreshProfile() async {
    isLoading.value = true;
    try {
      final profile = await _getProfile();
      fullName.value = profile.fullName;
      email.value = profile.email;
      phone.value = profile.phone ?? '';
      paymentHandle.value = profile.paymentHandle ?? '';
      defaultCurrency.value = profile.defaultCurrency;
      preferredLocale.value = profile.preferredLocale;
    } catch (_) {
      formError.value = 'load';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> save(AppLocalizations l10n) async {
    successMessage.value = null;
    formError.value = null;
    if (fullName.value.trim().isEmpty) {
      fieldErrors['fullName'] = l10n.profileSetupErrorFullName;
      return;
    }
    fieldErrors.clear();
    isSubmitting.value = true;
    try {
      await _updateProfile(
        UpdateProfileParams(
          fullName: fullName.value.trim(),
          phone: phone.value.trim().isEmpty ? null : phone.value.trim(),
          paymentHandle: paymentHandle.value.trim().isEmpty
              ? null
              : paymentHandle.value.trim(),
          defaultCurrency: defaultCurrency.value,
          preferredLocale: preferredLocale.value,
        ),
      );
      if (!Get.testMode) {
        await Get.updateLocale(Locale(preferredLocale.value));
      }
      successMessage.value = l10n.profileSaveSuccess;
      isEditing.value = false;
    } on ApiException catch (_) {
      formError.value = l10n.profileSetupErrorGeneric;
    } catch (_) {
      formError.value = l10n.profileSetupErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }
}
