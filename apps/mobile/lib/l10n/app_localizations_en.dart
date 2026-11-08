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

  @override
  String get loginErrorGoogle => 'Could not continue with Google. Try again.';

  @override
  String get loginGoogleCancelled => 'Google sign in was cancelled.';

  @override
  String get loginSessionExpired =>
      'Your session has expired. Please sign in again.';

  @override
  String get verifyEmailTitle => 'Verify your email';

  @override
  String get verifyEmailSubtitle =>
      'Enter the 6-digit code we sent to your inbox.';

  @override
  String get verifyEmailCodeLabel => 'Verification code';

  @override
  String get verifyEmailSubmit => 'Verify email';

  @override
  String get verifyEmailSubmitting => 'Verifying…';

  @override
  String get verifyEmailResend => 'Resend code';

  @override
  String verifyEmailResendCooldown(int seconds) {
    return 'Resend in ${seconds}s';
  }

  @override
  String get verifyEmailResendSent => 'Code resent! Check your inbox.';

  @override
  String get verifyEmailSuccessTitle => 'Email verified!';

  @override
  String get verifyEmailSuccessBody =>
      'Your email has been confirmed. Tap continue to get started.';

  @override
  String get verifyEmailContinue => 'Continue';

  @override
  String get verifyEmailErrorInvalidCode => 'Enter a 6-digit number';

  @override
  String get verifyEmailErrorInvalid =>
      'That code is invalid, expired, or already used.';

  @override
  String get verifyEmailErrorGeneric =>
      'Could not verify your email. Try again.';

  @override
  String get forgotPasswordTitle => 'Forgot password?';

  @override
  String get forgotPasswordSubtitle =>
      'Enter your email and we\'ll send a reset link.';

  @override
  String get forgotPasswordEmailLabel => 'Email';

  @override
  String get forgotPasswordEmailPlaceholder => 'you@example.com';

  @override
  String get forgotPasswordSubmit => 'Send reset link';

  @override
  String get forgotPasswordSubmitting => 'Sending…';

  @override
  String get forgotPasswordSuccessTitle => 'Check your inbox';

  @override
  String get forgotPasswordSuccessBody =>
      'If an account with that email exists, we\'ve sent a reset link.';

  @override
  String get forgotPasswordBackToSignIn => 'Back to sign in';

  @override
  String get forgotPasswordErrorEmail => 'Enter a valid email address';

  @override
  String get forgotPasswordErrorGeneric =>
      'Something went wrong. Please try again.';

  @override
  String get resetPasswordTitle => 'Set new password';

  @override
  String get resetPasswordSubtitle =>
      'Choose a strong password for your account.';

  @override
  String get resetPasswordPasswordLabel => 'New password';

  @override
  String get resetPasswordPasswordPlaceholder => 'At least 8 characters';

  @override
  String get resetPasswordPasswordHelper =>
      '8+ characters, a number and a capital';

  @override
  String get resetPasswordShowPasswordAria => 'Show password';

  @override
  String get resetPasswordHidePasswordAria => 'Hide password';

  @override
  String get resetPasswordSubmit => 'Reset password';

  @override
  String get resetPasswordSubmitting => 'Resetting…';

  @override
  String get resetPasswordSuccessTitle => 'Password updated!';

  @override
  String get resetPasswordSuccessBody =>
      'Your password has been reset. Sign in with your new password.';

  @override
  String get resetPasswordBackToSignIn => 'Sign in';

  @override
  String get resetPasswordErrorPassword =>
      'Use 8+ characters with a number and a capital letter';

  @override
  String get resetPasswordErrorInvalidToken =>
      'This reset link is invalid, expired, or already used. Request a new one.';

  @override
  String get resetPasswordErrorGeneric =>
      'Could not reset your password. Try again.';
}
