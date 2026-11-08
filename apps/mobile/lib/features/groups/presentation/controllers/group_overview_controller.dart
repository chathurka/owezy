import 'dart:math';

import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../core/errors/api_exception.dart';
import '../../../../core/network/safe_api_call.dart';
import '../../data/datasources/groups_remote_data_source.dart';

class GroupOverviewController extends GetxController {
  GroupOverviewController(this._remote);

  final GroupsRemoteDataSource _remote;

  final overview = Rxn<GroupOverviewModel>();
  final isLoading = false.obs;
  final error = RxnString();
  final inviteToken = RxnString();
  final inviteBusy = false.obs;
  final members = <Map<String, dynamic>>[].obs;

  late final String groupId;

  @override
  void onInit() {
    super.onInit();
    groupId = Get.parameters['id'] ?? '';
    load();
  }

  Future<void> load([AppLocalizations? l10n]) async {
    if (groupId.isEmpty) {
      error.value = l10n?.groupsOverviewError ?? 'error';
      return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      overview.value =
          await safeApiCall(() => _remote.getOverview(groupId));
      members.assignAll(
        await safeApiCall(() => _remote.listMembers(groupId)),
      );
    } on ApiException catch (_) {
      error.value = l10n?.groupsOverviewError ?? 'error';
    } catch (_) {
      error.value = l10n?.groupsOverviewError ?? 'error';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> createInvitation(AppLocalizations l10n) async {
    inviteBusy.value = true;
    error.value = null;
    try {
      final created = await safeApiCall(
        () => _remote.createInvitation(groupId: groupId, id: _newUuid()),
      );
      inviteToken.value = created['token'] as String?;
    } on ApiException catch (_) {
      error.value = l10n.groupsInviteError;
    } catch (_) {
      error.value = l10n.groupsInviteError;
    } finally {
      inviteBusy.value = false;
    }
  }

  static String _newUuid() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    String hex(int b) => b.toRadixString(16).padLeft(2, '0');
    final h = bytes.map(hex).join();
    return '${h.substring(0, 8)}-${h.substring(8, 12)}-${h.substring(12, 16)}-${h.substring(16, 20)}-${h.substring(20)}';
  }
}
