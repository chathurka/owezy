import 'package:owezy_mobile/l10n/app_localizations.dart';
import 'package:get/get.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/errors/api_exception.dart';
import '../../domain/entities/auth_session.dart';
import '../../domain/usecases/register_usecase.dart';
import '../../domain/usecases/sign_in_with_apple_usecase.dart';
import '../../domain/usecases/sign_in_with_google_usecase.dart';
import '../navigation/post_auth_navigation.dart';

// Design gap note (architecture doc §Open Questions):
// Mobile Create account screen does not show currency or terms fields.
// We auto-send USD + acceptedTerms=true so the API contract is satisfied.

class RegisterController extends GetxController {
  RegisterController(
    this._register,
    this._signInWithApple,
    this._signInWithGoogle,
  );

  final RegisterUseCase _register;
  final SignInWithAppleUseCase _signInWithApple;
  final SignInWithGoogleUseCase _signInWithGoogle;

  final fullName = ''.obs;
  final email = ''.obs;
  final password = ''.obs;
  final obscurePassword = true.obs;
  final isSubmitting = false.obs;
  final didSucceed = false.obs;
  final registeredEmail = ''.obs;
  final fieldErrors = <String, String>{}.obs;
  final formError = RxnString();

  // ── Password strength ────────────────────────────────────────────────────

  /// 0 = empty/too short · 1 weak · 2 fair · 3 good · 4 strong
  int get passwordStrengthScore {
    final pw = password.value;
    if (pw.isEmpty || pw.length < 8) return 0;
    var score = 1;
    if (RegExp(r'[A-Z]').hasMatch(pw)) score += 1;
    if (RegExp(r'\d').hasMatch(pw)) score += 1;
    if (RegExp(r'[^A-Za-z0-9]').hasMatch(pw) || pw.length >= 12) score += 1;
    return score;
  }

  String passwordStrengthLabel(AppLocalizations l10n) {
    final pw = password.value;
    if (pw.isEmpty) return l10n.registerStrengthUseMin;
    if (passwordStrengthScore == 0) return l10n.registerStrengthTooShort;
    return switch (passwordStrengthScore) {
      1 => l10n.registerStrengthWeak,
      2 => l10n.registerStrengthFair,
      3 => l10n.registerStrengthGood,
      _ => l10n.registerStrengthStrong,
    };
  }

  // ── UI actions ───────────────────────────────────────────────────────────

  void toggleObscure() => obscurePassword.value = !obscurePassword.value;

  // ── Validation ───────────────────────────────────────────────────────────

  bool _validate(AppLocalizations l10n) {
    final errors = <String, String>{};
    if (fullName.value.trim().length < 2) {
      errors['fullName'] = l10n.registerErrorFullName;
    }
    if (!GetUtils.isEmail(email.value.trim())) {
      errors['email'] = l10n.registerErrorEmail;
    }
    final pw = password.value;
    if (pw.length < 8 || !RegExp(r'[A-Z]').hasMatch(pw) || !RegExp(r'\d').hasMatch(pw)) {
      errors['password'] = l10n.registerErrorPassword;
    }
    fieldErrors.assignAll(errors);
    return errors.isEmpty;
  }

  // ── Submit ───────────────────────────────────────────────────────────────

  Future<void> submit(AppLocalizations l10n) async {
    formError.value = null;
    if (!_validate(l10n)) return;

    isSubmitting.value = true;
    try {
      final session = await _register(
        RegisterParams(
          fullName: fullName.value.trim(),
          email: email.value.trim(),
          password: password.value,
          // Mobile UI does not expose these; API defaults applied here.
          defaultCurrency: 'USD',
          acceptedTerms: true,
        ),
      );
      registeredEmail.value = session.user.email;
      didSucceed.value = true;
    } on ApiException catch (e) {
      formError.value =
          e.statusCode == 409 ? l10n.registerErrorEmailTaken : l10n.registerErrorGeneric;
    } catch (_) {
      formError.value = l10n.registerErrorGeneric;
    } finally {
      isSubmitting.value = false;
    }
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

  // ── Success actions ──────────────────────────────────────────────────────

  void useDifferentEmail() {
    didSucceed.value = false;
    email.value = '';
    formError.value = null;
    fieldErrors.clear();
  }
}
