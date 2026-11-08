import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/errors/api_exception.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/usecases/get_profile_usecase.dart';
import '../../domain/usecases/update_profile_usecase.dart';

class ProfileSetupController extends GetxController {
  ProfileSetupController(this._getProfile, this._updateProfile);

  final GetProfileUseCase _getProfile;
  final UpdateProfileUseCase _updateProfile;

  final fullName = ''.obs;
  final phone = ''.obs;
  final paymentHandle = ''.obs;
  final defaultCurrency = 'USD'.obs;
  final isSubmitting = false.obs;
  final isLoading = true.obs;
  final fieldErrors = <String, String>{}.obs;
  final formError = RxnString();

  @override
  void onInit() {
    super.onInit();
    _load();
  }

  Future<void> _load() async {
    isLoading.value = true;
    try {
      final profile = await _getProfile();
      if (!profile.needsProfileSetup) {
        Get.offAllNamed(AppRoutes.home);
        return;
      }
      fullName.value = profile.fullName;
      phone.value = profile.phone ?? '';
      paymentHandle.value = profile.paymentHandle ?? '';
      if (kAllowedCurrencies.contains(profile.defaultCurrency)) {
        defaultCurrency.value = profile.defaultCurrency;
      }
    } catch (_) {
      // Keep empty form; submit will surface auth errors.
    } finally {
      isLoading.value = false;
    }
  }

  String initials() {
    final parts =
        fullName.value.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty);
    if (parts.isEmpty) return '?';
    final list = parts.toList();
    if (list.length == 1) {
      return list.first.substring(0, list.first.length.clamp(0, 2)).toUpperCase();
    }
    final a = list[0].isNotEmpty ? list[0][0] : '';
    final b = list[1].isNotEmpty ? list[1][0] : '';
    return '$a$b'.toUpperCase();
  }

  bool _validate(AppLocalizations l10n) {
    final errors = <String, String>{};
    if (fullName.value.trim().isEmpty) {
      errors['fullName'] = l10n.profileSetupErrorFullName;
    }
    fieldErrors.assignAll(errors);
    return errors.isEmpty;
  }

  Future<void> submit(AppLocalizations l10n) async {
    formError.value = null;
    if (!_validate(l10n)) return;

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
          completeSetup: true,
        ),
      );
    } on ApiException catch (_) {
      formError.value = l10n.profileSetupErrorGeneric;
      return;
    } catch (_) {
      formError.value = l10n.profileSetupErrorGeneric;
      return;
    } finally {
      isSubmitting.value = false;
    }

    Get.offAllNamed(AppRoutes.home);
  }
}
