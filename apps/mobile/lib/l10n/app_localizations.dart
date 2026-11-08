import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';

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
  static const List<Locale> supportedLocales = <Locale>[Locale('en')];

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
      <String>['en'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
