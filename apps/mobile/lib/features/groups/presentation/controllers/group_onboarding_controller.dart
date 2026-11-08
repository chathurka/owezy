import 'dart:math';

import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/errors/api_exception.dart';
import '../../../../core/network/safe_api_call.dart';
import '../../../profile/domain/entities/user_profile.dart';
import '../../../profile/domain/usecases/update_profile_usecase.dart';
import '../../data/datasources/groups_remote_data_source.dart';

class GroupOnboardingController extends GetxController {
  GroupOnboardingController(this._remote, this._updateProfile);

  final GroupsRemoteDataSource _remote;
  final UpdateProfileUseCase _updateProfile;

  final mode = 'choose'.obs;
  final name = ''.obs;
  final inviteCode = ''.obs;
  final isSubmitting = false.obs;
  final formError = RxnString();

  String _clientUuid() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    String hex(int b) => b.toRadixString(16).padLeft(2, '0');
    final h = bytes.map(hex).join();
    return '${h.substring(0, 8)}-${h.substring(8, 12)}-${h.substring(12, 16)}-${h.substring(16, 20)}-${h.substring(20)}';
  }

  Future<void> create(AppLocalizations l10n) async {
    if (name.value.trim().isEmpty) {
      formError.value = l10n.onboardingGroupErrorName;
      return;
    }
    isSubmitting.value = true;
    formError.value = null;
    try {
      await safeApiCall(
        () => _remote.create(
          id: _clientUuid(),
          name: name.value.trim(),
        ),
      );
      Get.offAllNamed(AppRoutes.home);
    } on ApiException catch (_) {
      formError.value = l10n.onboardingGroupErrorGeneric;
    } catch (_) {
      formError.value = l10n.onboardingGroupErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }

  Future<void> join(AppLocalizations l10n) async {
    if (inviteCode.value.trim().length < 4) {
      formError.value = l10n.onboardingGroupErrorCode;
      return;
    }
    isSubmitting.value = true;
    formError.value = null;
    try {
      await safeApiCall(
        () => _remote.join(inviteCode: inviteCode.value.trim()),
      );
      Get.offAllNamed(AppRoutes.home);
    } on ApiException catch (_) {
      formError.value = l10n.onboardingGroupErrorGeneric;
    } catch (_) {
      formError.value = l10n.onboardingGroupErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }

  Future<void> skip(AppLocalizations l10n) async {
    isSubmitting.value = true;
    formError.value = null;
    try {
      await _updateProfile(
        const UpdateProfileParams(completeGroupOnboarding: true),
      );
      Get.offAllNamed(AppRoutes.home);
    } on ApiException catch (_) {
      formError.value = l10n.onboardingGroupErrorGeneric;
    } catch (_) {
      formError.value = l10n.onboardingGroupErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }
}
