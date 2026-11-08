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
    } on ApiException catch (_) {
      error.value = l10n?.groupsOverviewError ?? 'error';
    } catch (_) {
      error.value = l10n?.groupsOverviewError ?? 'error';
    } finally {
      isLoading.value = false;
    }
  }
}
