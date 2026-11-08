import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../core/errors/api_exception.dart';
import '../../../../core/network/safe_api_call.dart';
import '../../data/datasources/groups_remote_data_source.dart';

class GroupsListController extends GetxController {
  GroupsListController(this._remote);

  final GroupsRemoteDataSource _remote;

  final items = <GroupModel>[].obs;
  final isLoading = false.obs;
  final error = RxnString();

  @override
  void onInit() {
    super.onInit();
    refreshList();
  }

  Future<void> refreshList([AppLocalizations? l10n]) async {
    isLoading.value = true;
    error.value = null;
    try {
      final result = await safeApiCall(_remote.listMine);
      items.assignAll(result);
    } on ApiException catch (_) {
      error.value = l10n?.groupsCreateErrorGeneric ?? 'error';
    } catch (_) {
      error.value = l10n?.groupsCreateErrorGeneric ?? 'error';
    } finally {
      isLoading.value = false;
    }
  }
}
