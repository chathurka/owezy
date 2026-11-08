class AuthUser {
  const AuthUser({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    required this.emailVerified,
    required this.defaultCurrency,
    this.phone,
    this.paymentHandle,
    this.avatarUrl,
    this.profileSetupCompletedAt,
    this.preferredLocale = 'en',
  });

  final String id;
  final String email;
  final String fullName;
  final String role;
  final bool emailVerified;
  final String defaultCurrency;
  final String? phone;
  final String? paymentHandle;
  final String? avatarUrl;
  final DateTime? profileSetupCompletedAt;
  final String preferredLocale;

  bool get needsProfileSetup => profileSetupCompletedAt == null;
}

class AuthSession {
  const AuthSession({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
    required this.emailVerificationRequired,
  });

  final String accessToken;
  final String refreshToken;
  final AuthUser user;
  final bool emailVerificationRequired;
}

class RegisterParams {
  const RegisterParams({
    required this.fullName,
    required this.email,
    required this.password,
    required this.defaultCurrency,
    required this.acceptedTerms,
  });

  final String fullName;
  final String email;
  final String password;
  final String defaultCurrency;
  final bool acceptedTerms;
}

class LoginParams {
  const LoginParams({
    required this.email,
    required this.password,
  });

  final String email;
  final String password;
}
