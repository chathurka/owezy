import 'dart:math';

import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/errors/api_exception.dart';
import '../../../../core/network/safe_api_call.dart';
import '../../data/datasources/groups_remote_data_source.dart';

class CreateGroupController extends GetxController {
  CreateGroupController(this._remote);

  final GroupsRemoteDataSource _remote;

  final name = ''.obs;
  final isSubmitting = false.obs;
  final formError = RxnString();

  late final String clientId = _newUuid();

  static String _newUuid() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    String hex(int b) => b.toRadixString(16).padLeft(2, '0');
    final h = bytes.map(hex).join();
    return '${h.substring(0, 8)}-${h.substring(8, 12)}-${h.substring(12, 16)}-${h.substring(16, 20)}-${h.substring(20)}';
  }

  Future<void> submit(AppLocalizations l10n) async {
    if (name.value.trim().isEmpty) {
      formError.value = l10n.groupsCreateErrorName;
      return;
    }
    isSubmitting.value = true;
    formError.value = null;
    try {
      await safeApiCall(
        () => _remote.create(id: clientId, name: name.value.trim()),
      );
      Get.offNamed(AppRoutes.groups);
    } on ApiException catch (_) {
      formError.value = l10n.groupsCreateErrorGeneric;
    } catch (_) {
      formError.value = l10n.groupsCreateErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }
}
