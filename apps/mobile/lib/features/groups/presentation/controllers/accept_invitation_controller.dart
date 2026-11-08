import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/errors/api_exception.dart';
import '../../../../core/network/safe_api_call.dart';
import '../../data/datasources/groups_remote_data_source.dart';

class AcceptInvitationController extends GetxController {
  AcceptInvitationController(this._remote);

  final GroupsRemoteDataSource _remote;

  final token = ''.obs;
  final isSubmitting = false.obs;
  final formError = RxnString();

  Future<void> submit(AppLocalizations l10n) async {
    if (token.value.trim().length < 16) {
      formError.value = l10n.groupsAcceptErrorToken;
      return;
    }
    isSubmitting.value = true;
    formError.value = null;
    try {
      final group = await safeApiCall(
        () => _remote.acceptInvitation(token: token.value.trim()),
      );
      Get.offNamed(
        AppRoutes.groupOverview.replaceFirst(':id', group.id),
      );
    } on ApiException catch (_) {
      formError.value = l10n.groupsAcceptErrorGeneric;
    } catch (_) {
      formError.value = l10n.groupsAcceptErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }
}
