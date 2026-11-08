class UserProfile {
  const UserProfile({
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

  bool get needsProfileSetup => profileSetupCompletedAt == null;
}

class UpdateProfileParams {
  const UpdateProfileParams({
    required this.fullName,
    this.phone,
    this.paymentHandle,
    this.completeSetup = false,
  });

  final String fullName;
  final String? phone;
  final String? paymentHandle;
  final bool completeSetup;
}
