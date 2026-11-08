import 'package:get/get.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

import '../../../../core/errors/api_exception.dart';
import '../../domain/entities/auth_session.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/sign_in_with_apple_usecase.dart';
import '../../domain/usecases/sign_in_with_google_usecase.dart';
import '../navigation/post_auth_navigation.dart';

class LoginController extends GetxController {
  LoginController(this._login, this._signInWithApple, this._signInWithGoogle);

  final LoginUseCase _login;
  final SignInWithAppleUseCase _signInWithApple;
  final SignInWithGoogleUseCase _signInWithGoogle;

  final email = ''.obs;
  final password = ''.obs;
  final obscurePassword = true.obs;
  final rememberMe = true.obs;
  final isSubmitting = false.obs;
  final fieldErrors = <String, String>{}.obs;
  final formError = RxnString();

  @override
  void onInit() {
    super.onInit();
    if (Get.parameters['reason'] == 'session-expired') {
      // Localized in the page via l10n when rendering formError; store key marker.
      formError.value = '__session_expired__';
    }
  }

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

    late final AuthSession session;
    isSubmitting.value = true;
    try {
      session = await _login(
        LoginParams(
          email: email.value.trim(),
          password: password.value,
        ),
      );
    } on ApiException catch (e) {
      formError.value = e.statusCode == 401
          ? l10n.loginErrorInvalidCredentials
          : l10n.loginErrorGeneric;
      return;
    } catch (_) {
      formError.value = l10n.loginErrorGeneric;
      return;
    } finally {
      isSubmitting.value = false;
    }

    // Remember-me is UI-only for MVP (refresh TTL stays 7d).
    // Navigate outside the login try/catch so routing errors aren't shown as auth failures.
    navigateAfterAuth(session.user);
  }

  Future<void> continueWithApple(AppLocalizations l10n) async {
    formError.value = null;
    isSubmitting.value = true;
    late final AuthSession session;
    try {
      final result = await _signInWithApple();
      if (result == null) {
        formError.value = l10n.loginAppleCancelled;
        return;
      }
      session = result;
    } on ApiException catch (_) {
      formError.value = l10n.loginErrorApple;
      return;
    } catch (_) {
      formError.value = l10n.loginErrorApple;
      return;
    } finally {
      isSubmitting.value = false;
    }

    navigateAfterAuth(session.user);
  }

  Future<void> continueWithGoogle(AppLocalizations l10n) async {
    formError.value = null;
    isSubmitting.value = true;
    late final AuthSession session;
    try {
      final result = await _signInWithGoogle();
      if (result == null) {
        formError.value = l10n.loginGoogleCancelled;
        return;
      }
      session = result;
    } on ApiException catch (_) {
      formError.value = l10n.loginErrorGoogle;
      return;
    } catch (_) {
      formError.value = l10n.loginErrorGoogle;
      return;
    } finally {
      isSubmitting.value = false;
    }

    navigateAfterAuth(session.user);
  }
}
