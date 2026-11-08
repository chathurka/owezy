import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_si.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('si'),
  ];

  /// No description provided for @appName.
  ///
  /// In en, this message translates to:
  /// **'Owezy'**
  String get appName;

  /// No description provided for @homeWelcomeTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome to Owezy'**
  String get homeWelcomeTitle;

  /// No description provided for @homeWelcomeSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Split expenses, track balances, settle debts.'**
  String get homeWelcomeSubtitle;

  /// No description provided for @registerTitle.
  ///
  /// In en, this message translates to:
  /// **'Create account'**
  String get registerTitle;

  /// No description provided for @registerSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Start splitting in under a minute.'**
  String get registerSubtitle;

  /// No description provided for @registerFullNameLabel.
  ///
  /// In en, this message translates to:
  /// **'Full name'**
  String get registerFullNameLabel;

  /// No description provided for @registerFullNamePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Alex Morgan'**
  String get registerFullNamePlaceholder;

  /// No description provided for @registerEmailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get registerEmailLabel;

  /// No description provided for @registerEmailPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'alex.morgan@mail.com'**
  String get registerEmailPlaceholder;

  /// No description provided for @registerPasswordLabel.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get registerPasswordLabel;

  /// No description provided for @registerPasswordPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'At least 8 characters'**
  String get registerPasswordPlaceholder;

  /// No description provided for @registerPasswordHelper.
  ///
  /// In en, this message translates to:
  /// **'8+ characters, a number and a capital'**
  String get registerPasswordHelper;

  /// No description provided for @registerShowPasswordAria.
  ///
  /// In en, this message translates to:
  /// **'Show password'**
  String get registerShowPasswordAria;

  /// No description provided for @registerHidePasswordAria.
  ///
  /// In en, this message translates to:
  /// **'Hide password'**
  String get registerHidePasswordAria;

  /// No description provided for @registerContinueApple.
  ///
  /// In en, this message translates to:
  /// **'Continue with Apple'**
  String get registerContinueApple;

  /// No description provided for @registerContinueGoogle.
  ///
  /// In en, this message translates to:
  /// **'Continue with Google'**
  String get registerContinueGoogle;

  /// No description provided for @registerOrEmail.
  ///
  /// In en, this message translates to:
  /// **'or sign up with email'**
  String get registerOrEmail;

  /// No description provided for @registerSignInPrompt.
  ///
  /// In en, this message translates to:
  /// **'Already have an account?'**
  String get registerSignInPrompt;

  /// No description provided for @registerSignIn.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get registerSignIn;

  /// No description provided for @registerSubmit.
  ///
  /// In en, this message translates to:
  /// **'Create account'**
  String get registerSubmit;

  /// No description provided for @registerSubmitting.
  ///
  /// In en, this message translates to:
  /// **'Creating account…'**
  String get registerSubmitting;

  /// No description provided for @registerStrengthUseMin.
  ///
  /// In en, this message translates to:
  /// **'Use at least 8 characters'**
  String get registerStrengthUseMin;

  /// No description provided for @registerStrengthTooShort.
  ///
  /// In en, this message translates to:
  /// **'Too short'**
  String get registerStrengthTooShort;

  /// No description provided for @registerStrengthWeak.
  ///
  /// In en, this message translates to:
  /// **'Weak'**
  String get registerStrengthWeak;

  /// No description provided for @registerStrengthFair.
  ///
  /// In en, this message translates to:
  /// **'Fair'**
  String get registerStrengthFair;

  /// No description provided for @registerStrengthGood.
  ///
  /// In en, this message translates to:
  /// **'Good'**
  String get registerStrengthGood;

  /// No description provided for @registerStrengthStrong.
  ///
  /// In en, this message translates to:
  /// **'Strong'**
  String get registerStrengthStrong;

  /// No description provided for @registerSuccessTitle.
  ///
  /// In en, this message translates to:
  /// **'Check your inbox'**
  String get registerSuccessTitle;

  /// No description provided for @registerSuccessBodyPrefix.
  ///
  /// In en, this message translates to:
  /// **'We sent a confirmation link to'**
  String get registerSuccessBodyPrefix;

  /// No description provided for @registerSuccessBody.
  ///
  /// In en, this message translates to:
  /// **'We sent a confirmation link to {email}'**
  String registerSuccessBody(String email);

  /// No description provided for @registerStepConfirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm your email'**
  String get registerStepConfirm;

  /// No description provided for @registerStepGroup.
  ///
  /// In en, this message translates to:
  /// **'Create your first group'**
  String get registerStepGroup;

  /// No description provided for @registerStepInvite.
  ///
  /// In en, this message translates to:
  /// **'Invite friends and add an expense'**
  String get registerStepInvite;

  /// No description provided for @registerContinue.
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get registerContinue;

  /// No description provided for @registerUseDifferentEmail.
  ///
  /// In en, this message translates to:
  /// **'Use a different email'**
  String get registerUseDifferentEmail;

  /// No description provided for @registerErrorFullName.
  ///
  /// In en, this message translates to:
  /// **'Tell us your name so friends recognise you'**
  String get registerErrorFullName;

  /// No description provided for @registerErrorEmail.
  ///
  /// In en, this message translates to:
  /// **'Enter a valid email address'**
  String get registerErrorEmail;

  /// No description provided for @registerErrorPassword.
  ///
  /// In en, this message translates to:
  /// **'Use 8+ characters with a number and a capital letter'**
  String get registerErrorPassword;

  /// No description provided for @registerErrorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Could not create your account. Try again.'**
  String get registerErrorGeneric;

  /// No description provided for @registerErrorEmailTaken.
  ///
  /// In en, this message translates to:
  /// **'An account with this email already exists.'**
  String get registerErrorEmailTaken;

  /// No description provided for @loginTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome back'**
  String get loginTitle;

  /// No description provided for @loginSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Sign in to keep splitting.'**
  String get loginSubtitle;

  /// No description provided for @loginEmailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get loginEmailLabel;

  /// No description provided for @loginEmailPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'you@example.com'**
  String get loginEmailPlaceholder;

  /// No description provided for @loginPasswordLabel.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get loginPasswordLabel;

  /// No description provided for @loginPasswordPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'At least 8 characters'**
  String get loginPasswordPlaceholder;

  /// No description provided for @loginShowPasswordAria.
  ///
  /// In en, this message translates to:
  /// **'Show password'**
  String get loginShowPasswordAria;

  /// No description provided for @loginHidePasswordAria.
  ///
  /// In en, this message translates to:
  /// **'Hide password'**
  String get loginHidePasswordAria;

  /// No description provided for @loginContinueApple.
  ///
  /// In en, this message translates to:
  /// **'Continue with Apple'**
  String get loginContinueApple;

  /// No description provided for @loginContinueGoogle.
  ///
  /// In en, this message translates to:
  /// **'Continue with Google'**
  String get loginContinueGoogle;

  /// No description provided for @loginOrEmail.
  ///
  /// In en, this message translates to:
  /// **'or sign in with email'**
  String get loginOrEmail;

  /// No description provided for @loginRememberMe.
  ///
  /// In en, this message translates to:
  /// **'Remember me'**
  String get loginRememberMe;

  /// No description provided for @loginForgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot password?'**
  String get loginForgotPassword;

  /// No description provided for @loginSubmit.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get loginSubmit;

  /// No description provided for @loginSubmitting.
  ///
  /// In en, this message translates to:
  /// **'Signing in…'**
  String get loginSubmitting;

  /// No description provided for @loginCreatePrompt.
  ///
  /// In en, this message translates to:
  /// **'New to Owezy?'**
  String get loginCreatePrompt;

  /// No description provided for @loginCreateAccount.
  ///
  /// In en, this message translates to:
  /// **'Create account'**
  String get loginCreateAccount;

  /// No description provided for @loginErrorEmail.
  ///
  /// In en, this message translates to:
  /// **'Enter a valid email address'**
  String get loginErrorEmail;

  /// No description provided for @loginErrorPassword.
  ///
  /// In en, this message translates to:
  /// **'Password must be at least 8 characters'**
  String get loginErrorPassword;

  /// No description provided for @loginErrorInvalidCredentials.
  ///
  /// In en, this message translates to:
  /// **'Invalid email or password'**
  String get loginErrorInvalidCredentials;

  /// No description provided for @loginErrorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Could not sign you in. Try again.'**
  String get loginErrorGeneric;

  /// No description provided for @loginErrorApple.
  ///
  /// In en, this message translates to:
  /// **'Could not continue with Apple. Try again.'**
  String get loginErrorApple;

  /// No description provided for @loginAppleCancelled.
  ///
  /// In en, this message translates to:
  /// **'Apple sign in was cancelled.'**
  String get loginAppleCancelled;

  /// No description provided for @loginErrorGoogle.
  ///
  /// In en, this message translates to:
  /// **'Could not continue with Google. Try again.'**
  String get loginErrorGoogle;

  /// No description provided for @loginGoogleCancelled.
  ///
  /// In en, this message translates to:
  /// **'Google sign in was cancelled.'**
  String get loginGoogleCancelled;

  /// No description provided for @loginSessionExpired.
  ///
  /// In en, this message translates to:
  /// **'Your session has expired. Please sign in again.'**
  String get loginSessionExpired;

  /// No description provided for @verifyEmailTitle.
  ///
  /// In en, this message translates to:
  /// **'Verify your email'**
  String get verifyEmailTitle;

  /// No description provided for @verifyEmailSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter the 6-digit code we sent to your inbox.'**
  String get verifyEmailSubtitle;

  /// No description provided for @verifyEmailCodeLabel.
  ///
  /// In en, this message translates to:
  /// **'Verification code'**
  String get verifyEmailCodeLabel;

  /// No description provided for @verifyEmailSubmit.
  ///
  /// In en, this message translates to:
  /// **'Verify email'**
  String get verifyEmailSubmit;

  /// No description provided for @verifyEmailSubmitting.
  ///
  /// In en, this message translates to:
  /// **'Verifying…'**
  String get verifyEmailSubmitting;

  /// No description provided for @verifyEmailResend.
  ///
  /// In en, this message translates to:
  /// **'Resend code'**
  String get verifyEmailResend;

  /// No description provided for @verifyEmailResendCooldown.
  ///
  /// In en, this message translates to:
  /// **'Resend in {seconds}s'**
  String verifyEmailResendCooldown(int seconds);

  /// No description provided for @verifyEmailResendSent.
  ///
  /// In en, this message translates to:
  /// **'Code resent! Check your inbox.'**
  String get verifyEmailResendSent;

  /// No description provided for @verifyEmailSuccessTitle.
  ///
  /// In en, this message translates to:
  /// **'Email verified!'**
  String get verifyEmailSuccessTitle;

  /// No description provided for @verifyEmailSuccessBody.
  ///
  /// In en, this message translates to:
  /// **'Your email has been confirmed. Tap continue to get started.'**
  String get verifyEmailSuccessBody;

  /// No description provided for @verifyEmailContinue.
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get verifyEmailContinue;

  /// No description provided for @verifyEmailErrorInvalidCode.
  ///
  /// In en, this message translates to:
  /// **'Enter a 6-digit number'**
  String get verifyEmailErrorInvalidCode;

  /// No description provided for @verifyEmailErrorInvalid.
  ///
  /// In en, this message translates to:
  /// **'That code is invalid, expired, or already used.'**
  String get verifyEmailErrorInvalid;

  /// No description provided for @verifyEmailErrorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Could not verify your email. Try again.'**
  String get verifyEmailErrorGeneric;

  /// No description provided for @forgotPasswordTitle.
  ///
  /// In en, this message translates to:
  /// **'Forgot password?'**
  String get forgotPasswordTitle;

  /// No description provided for @forgotPasswordSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your email and we\'ll send a reset link.'**
  String get forgotPasswordSubtitle;

  /// No description provided for @forgotPasswordEmailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get forgotPasswordEmailLabel;

  /// No description provided for @forgotPasswordEmailPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'you@example.com'**
  String get forgotPasswordEmailPlaceholder;

  /// No description provided for @forgotPasswordSubmit.
  ///
  /// In en, this message translates to:
  /// **'Send reset link'**
  String get forgotPasswordSubmit;

  /// No description provided for @forgotPasswordSubmitting.
  ///
  /// In en, this message translates to:
  /// **'Sending…'**
  String get forgotPasswordSubmitting;

  /// No description provided for @forgotPasswordSuccessTitle.
  ///
  /// In en, this message translates to:
  /// **'Check your inbox'**
  String get forgotPasswordSuccessTitle;

  /// No description provided for @forgotPasswordSuccessBody.
  ///
  /// In en, this message translates to:
  /// **'If an account with that email exists, we\'ve sent a reset link.'**
  String get forgotPasswordSuccessBody;

  /// No description provided for @forgotPasswordBackToSignIn.
  ///
  /// In en, this message translates to:
  /// **'Back to sign in'**
  String get forgotPasswordBackToSignIn;

  /// No description provided for @forgotPasswordErrorEmail.
  ///
  /// In en, this message translates to:
  /// **'Enter a valid email address'**
  String get forgotPasswordErrorEmail;

  /// No description provided for @forgotPasswordErrorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. Please try again.'**
  String get forgotPasswordErrorGeneric;

  /// No description provided for @resetPasswordTitle.
  ///
  /// In en, this message translates to:
  /// **'Set new password'**
  String get resetPasswordTitle;

  /// No description provided for @resetPasswordSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Choose a strong password for your account.'**
  String get resetPasswordSubtitle;

  /// No description provided for @resetPasswordPasswordLabel.
  ///
  /// In en, this message translates to:
  /// **'New password'**
  String get resetPasswordPasswordLabel;

  /// No description provided for @resetPasswordPasswordPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'At least 8 characters'**
  String get resetPasswordPasswordPlaceholder;

  /// No description provided for @resetPasswordPasswordHelper.
  ///
  /// In en, this message translates to:
  /// **'8+ characters, a number and a capital'**
  String get resetPasswordPasswordHelper;

  /// No description provided for @resetPasswordShowPasswordAria.
  ///
  /// In en, this message translates to:
  /// **'Show password'**
  String get resetPasswordShowPasswordAria;

  /// No description provided for @resetPasswordHidePasswordAria.
  ///
  /// In en, this message translates to:
  /// **'Hide password'**
  String get resetPasswordHidePasswordAria;

  /// No description provided for @resetPasswordSubmit.
  ///
  /// In en, this message translates to:
  /// **'Reset password'**
  String get resetPasswordSubmit;

  /// No description provided for @resetPasswordSubmitting.
  ///
  /// In en, this message translates to:
  /// **'Resetting…'**
  String get resetPasswordSubmitting;

  /// No description provided for @resetPasswordSuccessTitle.
  ///
  /// In en, this message translates to:
  /// **'Password updated!'**
  String get resetPasswordSuccessTitle;

  /// No description provided for @resetPasswordSuccessBody.
  ///
  /// In en, this message translates to:
  /// **'Your password has been reset. Sign in with your new password.'**
  String get resetPasswordSuccessBody;

  /// No description provided for @resetPasswordBackToSignIn.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get resetPasswordBackToSignIn;

  /// No description provided for @resetPasswordErrorPassword.
  ///
  /// In en, this message translates to:
  /// **'Use 8+ characters with a number and a capital letter'**
  String get resetPasswordErrorPassword;

  /// No description provided for @resetPasswordErrorInvalidToken.
  ///
  /// In en, this message translates to:
  /// **'This reset link is invalid, expired, or already used. Request a new one.'**
  String get resetPasswordErrorInvalidToken;

  /// No description provided for @resetPasswordErrorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Could not reset your password. Try again.'**
  String get resetPasswordErrorGeneric;

  /// No description provided for @profileSetupTitle.
  ///
  /// In en, this message translates to:
  /// **'Complete your profile'**
  String get profileSetupTitle;

  /// No description provided for @profileSetupSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Help group members recognise you.'**
  String get profileSetupSubtitle;

  /// No description provided for @profileSetupFullNameLabel.
  ///
  /// In en, this message translates to:
  /// **'Full name'**
  String get profileSetupFullNameLabel;

  /// No description provided for @profileSetupFullNamePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Alex Morgan'**
  String get profileSetupFullNamePlaceholder;

  /// No description provided for @profileSetupPhoneLabel.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get profileSetupPhoneLabel;

  /// No description provided for @profileSetupPhonePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'+1 415 555 0142'**
  String get profileSetupPhonePlaceholder;

  /// No description provided for @profileSetupPaymentHandleLabel.
  ///
  /// In en, this message translates to:
  /// **'Payment handle'**
  String get profileSetupPaymentHandleLabel;

  /// No description provided for @profileSetupPaymentHandlePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'@alex-morgan'**
  String get profileSetupPaymentHandlePlaceholder;

  /// No description provided for @profileSetupCurrencyLabel.
  ///
  /// In en, this message translates to:
  /// **'Default currency'**
  String get profileSetupCurrencyLabel;

  /// No description provided for @profileSetupLanguageLabel.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get profileSetupLanguageLabel;

  /// No description provided for @profileSetupLanguageEn.
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get profileSetupLanguageEn;

  /// No description provided for @profileSetupLanguageSi.
  ///
  /// In en, this message translates to:
  /// **'සිංහල'**
  String get profileSetupLanguageSi;

  /// No description provided for @profileSetupSubmit.
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get profileSetupSubmit;

  /// No description provided for @profileSetupSubmitting.
  ///
  /// In en, this message translates to:
  /// **'Saving…'**
  String get profileSetupSubmitting;

  /// No description provided for @profileSetupErrorFullName.
  ///
  /// In en, this message translates to:
  /// **'Tell us your name so friends recognise you'**
  String get profileSetupErrorFullName;

  /// No description provided for @profileSetupErrorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Could not save your profile. Try again.'**
  String get profileSetupErrorGeneric;

  /// No description provided for @onboardingGroupTitle.
  ///
  /// In en, this message translates to:
  /// **'Create or join a group'**
  String get onboardingGroupTitle;

  /// No description provided for @onboardingGroupSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Split expenses with friends — you can skip this.'**
  String get onboardingGroupSubtitle;

  /// No description provided for @onboardingGroupCreate.
  ///
  /// In en, this message translates to:
  /// **'Create a group'**
  String get onboardingGroupCreate;

  /// No description provided for @onboardingGroupJoin.
  ///
  /// In en, this message translates to:
  /// **'Join with invite code'**
  String get onboardingGroupJoin;

  /// No description provided for @onboardingGroupSkip.
  ///
  /// In en, this message translates to:
  /// **'Skip for now'**
  String get onboardingGroupSkip;

  /// No description provided for @onboardingGroupNameLabel.
  ///
  /// In en, this message translates to:
  /// **'Group name'**
  String get onboardingGroupNameLabel;

  /// No description provided for @onboardingGroupNamePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Weekend trip'**
  String get onboardingGroupNamePlaceholder;

  /// No description provided for @onboardingGroupCodeLabel.
  ///
  /// In en, this message translates to:
  /// **'Invite code'**
  String get onboardingGroupCodeLabel;

  /// No description provided for @onboardingGroupCodePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'ABCD1234'**
  String get onboardingGroupCodePlaceholder;

  /// No description provided for @onboardingGroupCreateSubmit.
  ///
  /// In en, this message translates to:
  /// **'Create group'**
  String get onboardingGroupCreateSubmit;

  /// No description provided for @onboardingGroupJoinSubmit.
  ///
  /// In en, this message translates to:
  /// **'Join group'**
  String get onboardingGroupJoinSubmit;

  /// No description provided for @onboardingGroupBack.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get onboardingGroupBack;

  /// No description provided for @onboardingGroupErrorName.
  ///
  /// In en, this message translates to:
  /// **'Enter a group name'**
  String get onboardingGroupErrorName;

  /// No description provided for @onboardingGroupErrorCode.
  ///
  /// In en, this message translates to:
  /// **'Enter a valid invite code'**
  String get onboardingGroupErrorCode;

  /// No description provided for @onboardingGroupErrorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. Try again.'**
  String get onboardingGroupErrorGeneric;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'si'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'si':
      return AppLocalizationsSi();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
