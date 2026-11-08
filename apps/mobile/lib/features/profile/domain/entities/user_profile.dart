class UserProfile {
  const UserProfile({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    required this.emailVerified,
    required this.defaultCurrency,
    this.preferredLocale = 'en',
    this.phone,
    this.paymentHandle,
    this.avatarUrl,
    this.profileSetupCompletedAt,
  });

  final String id;
  final String email;
  final String fullName;
  final String role;
  final bool emailVerified;
  final String defaultCurrency;
  final String preferredLocale;
  final String? phone;
  final String? paymentHandle;
  final String? avatarUrl;
  final DateTime? profileSetupCompletedAt;

  bool get needsProfileSetup => profileSetupCompletedAt == null;
}

class UpdateProfileParams {
  const UpdateProfileParams({
    this.fullName,
    this.phone,
    this.paymentHandle,
    this.defaultCurrency,
    this.preferredLocale,
    this.completeSetup = false,
    this.completeGroupOnboarding = false,
  });

  final String? fullName;
  final String? phone;
  final String? paymentHandle;
  final String? defaultCurrency;
  final String? preferredLocale;
  final bool completeSetup;
  final bool completeGroupOnboarding;
}

const kAllowedCurrencies = ['USD', 'EUR', 'GBP', 'LKR', 'INR'];
const kAllowedLocales = ['en', 'si'];
