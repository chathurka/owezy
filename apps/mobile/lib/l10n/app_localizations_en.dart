// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'Owezy';

  @override
  String get homeWelcomeTitle => 'Welcome to Owezy';

  @override
  String get homeWelcomeSubtitle =>
      'Split expenses, track balances, settle debts.';

  @override
  String get registerTitle => 'Create account';

  @override
  String get registerSubtitle => 'Start splitting in under a minute.';

  @override
  String get registerFullNameLabel => 'Full name';

  @override
  String get registerFullNamePlaceholder => 'Alex Morgan';

  @override
  String get registerEmailLabel => 'Email';

  @override
  String get registerEmailPlaceholder => 'alex.morgan@mail.com';

  @override
  String get registerPasswordLabel => 'Password';

  @override
  String get registerPasswordPlaceholder => 'At least 8 characters';

  @override
  String get registerPasswordHelper => '8+ characters, a number and a capital';

  @override
  String get registerShowPasswordAria => 'Show password';

  @override
  String get registerHidePasswordAria => 'Hide password';

  @override
  String get registerContinueApple => 'Continue with Apple';

  @override
  String get registerContinueGoogle => 'Continue with Google';

  @override
  String get registerOrEmail => 'or sign up with email';

  @override
  String get registerSignInPrompt => 'Already have an account?';

  @override
  String get registerSignIn => 'Sign in';

  @override
  String get registerSubmit => 'Create account';

  @override
  String get registerSubmitting => 'Creating account…';

  @override
  String get registerStrengthUseMin => 'Use at least 8 characters';

  @override
  String get registerStrengthTooShort => 'Too short';

  @override
  String get registerStrengthWeak => 'Weak';

  @override
  String get registerStrengthFair => 'Fair';

  @override
  String get registerStrengthGood => 'Good';

  @override
  String get registerStrengthStrong => 'Strong';

  @override
  String get registerSuccessTitle => 'Check your inbox';

  @override
  String get registerSuccessBodyPrefix => 'We sent a confirmation link to';

  @override
  String registerSuccessBody(String email) {
    return 'We sent a confirmation link to $email';
  }

  @override
  String get registerStepConfirm => 'Confirm your email';

  @override
  String get registerStepGroup => 'Create your first group';

  @override
  String get registerStepInvite => 'Invite friends and add an expense';

  @override
  String get registerContinue => 'Continue';

  @override
  String get registerUseDifferentEmail => 'Use a different email';

  @override
  String get registerErrorFullName =>
      'Tell us your name so friends recognise you';

  @override
  String get registerErrorEmail => 'Enter a valid email address';

  @override
  String get registerErrorPassword =>
      'Use 8+ characters with a number and a capital letter';

  @override
  String get registerErrorGeneric =>
      'Could not create your account. Try again.';

  @override
  String get registerErrorEmailTaken =>
      'An account with this email already exists.';

  @override
  String get loginTitle => 'Welcome back';

  @override
  String get loginSubtitle => 'Sign in to keep splitting.';

  @override
  String get loginEmailLabel => 'Email';

  @override
  String get loginEmailPlaceholder => 'you@example.com';

  @override
  String get loginPasswordLabel => 'Password';

  @override
  String get loginPasswordPlaceholder => 'At least 8 characters';

  @override
  String get loginShowPasswordAria => 'Show password';

  @override
  String get loginHidePasswordAria => 'Hide password';

  @override
  String get loginContinueApple => 'Continue with Apple';

  @override
  String get loginContinueGoogle => 'Continue with Google';

  @override
  String get loginOrEmail => 'or sign in with email';

  @override
  String get loginRememberMe => 'Remember me';

  @override
  String get loginForgotPassword => 'Forgot password?';

  @override
  String get loginSubmit => 'Sign in';

  @override
  String get loginSubmitting => 'Signing in…';

  @override
  String get loginCreatePrompt => 'New to Owezy?';

  @override
  String get loginCreateAccount => 'Create account';

  @override
  String get loginErrorEmail => 'Enter a valid email address';

  @override
  String get loginErrorPassword => 'Password must be at least 8 characters';

  @override
  String get loginErrorInvalidCredentials => 'Invalid email or password';

  @override
  String get loginErrorGeneric => 'Could not sign you in. Try again.';

  @override
  String get loginErrorApple => 'Could not continue with Apple. Try again.';

  @override
  String get loginAppleCancelled => 'Apple sign in was cancelled.';
}
