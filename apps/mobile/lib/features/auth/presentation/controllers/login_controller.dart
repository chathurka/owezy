import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/errors/api_exception.dart';
import '../../domain/entities/auth_session.dart';
import '../../domain/usecases/login_usecase.dart';

class LoginController extends GetxController {
  LoginController(this._login);

  final LoginUseCase _login;

  final email = ''.obs;
  final password = ''.obs;
  final obscurePassword = true.obs;
  final rememberMe = true.obs;
  final isSubmitting = false.obs;
  final fieldErrors = <String, String>{}.obs;
  final formError = RxnString();

  void toggleObscure() => obscurePassword.value = !obscurePassword.value;

  void toggleRememberMe() => rememberMe.value = !rememberMe.value;

  bool _validate(AppLocalizations l10n) {
    final errors = <String, String>{};
    if (!GetUtils.isEmail(email.value.trim())) {
      errors['email'] = l10n.loginErrorEmail;
    }
    if (password.value.length < 8) {
      errors['password'] = l10n.loginErrorPassword;
    }
    fieldErrors.assignAll(errors);
    return errors.isEmpty;
  }

  Future<void> submit(AppLocalizations l10n) async {
    formError.value = null;
    if (!_validate(l10n)) return;

    isSubmitting.value = true;
    try {
      await _login(
        LoginParams(
          email: email.value.trim(),
          password: password.value,
        ),
      );
      // Remember-me is UI-only for MVP (refresh TTL stays 7d).
      Get.offAllNamed(AppRoutes.home);
    } on ApiException catch (e) {
      formError.value = e.statusCode == 401
          ? l10n.loginErrorInvalidCredentials
          : l10n.loginErrorGeneric;
    } catch (_) {
      formError.value = l10n.loginErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
  }
}
