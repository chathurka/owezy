import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../app/routes/app_routes.dart';
import '../../domain/usecases/forgot_password_usecase.dart';

class ForgotPasswordController extends GetxController {
  ForgotPasswordController(this._forgotPassword);

  final ForgotPasswordUseCase _forgotPassword;

  final email = ''.obs;
  final isSubmitting = false.obs;
  final didSucceed = false.obs;
  final fieldError = RxnString();
  final formError = RxnString();

  bool _validate(AppLocalizations l10n) {
    if (!GetUtils.isEmail(email.value.trim())) {
      fieldError.value = l10n.forgotPasswordErrorEmail;
      return false;
    }
    fieldError.value = null;
    return true;
  }

  Future<void> submit(AppLocalizations l10n) async {
    formError.value = null;
    if (!_validate(l10n)) return;

    isSubmitting.value = true;
    try {
      await _forgotPassword(email.value.trim());
      // Always show success — non-enumerating
      didSucceed.value = true;
    } catch (_) {
      // Non-enumerating: show success regardless
      didSucceed.value = true;
    } finally {
      isSubmitting.value = false;
    }
  }

  void goToSignIn() => Get.offAllNamed(AppRoutes.login);
}
