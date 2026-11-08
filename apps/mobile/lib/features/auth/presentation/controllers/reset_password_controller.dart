import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/errors/api_exception.dart';
import '../../domain/usecases/reset_password_usecase.dart';

class ResetPasswordController extends GetxController {
  ResetPasswordController(this._resetPassword);

  final ResetPasswordUseCase _resetPassword;

  /// Token passed via route arguments or query param.
  String token = '';

  final password = ''.obs;
  final obscurePassword = true.obs;
  final isSubmitting = false.obs;
  final didSucceed = false.obs;
  final fieldError = RxnString();
  final formError = RxnString();

  void toggleObscure() => obscurePassword.value = !obscurePassword.value;

  bool _validate(AppLocalizations l10n) {
    final pw = password.value;
    if (pw.length < 8 || !pw.contains(RegExp(r'[A-Z]')) || !pw.contains(RegExp(r'[0-9]'))) {
      fieldError.value = l10n.resetPasswordErrorPassword;
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
      await _resetPassword(token: token, password: password.value);
      didSucceed.value = true;
    } on ApiException catch (e) {
      formError.value = e.statusCode == 400
          ? l10n.resetPasswordErrorInvalidToken
          : l10n.resetPasswordErrorGeneric;
    } catch (_) {
      formError.value = l10n.resetPasswordErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }

  void goToSignIn() => Get.offAllNamed(AppRoutes.login);
}
