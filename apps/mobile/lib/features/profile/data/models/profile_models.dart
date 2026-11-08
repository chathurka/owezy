import '../../domain/entities/user_profile.dart';

class UserProfileModel {
  const UserProfileModel({
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
  final String? profileSetupCompletedAt;

  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    return UserProfileModel(
      id: json['id'] as String,
      email: json['email'] as String,
      fullName: json['fullName'] as String,
      role: json['role'] as String,
      emailVerified: json['emailVerified'] as bool,
      defaultCurrency: json['defaultCurrency'] as String,
      phone: json['phone'] as String?,
      paymentHandle: json['paymentHandle'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      profileSetupCompletedAt: json['profileSetupCompletedAt'] as String?,
    );
  }

  UserProfile toEntity() => UserProfile(
        id: id,
        email: email,
        fullName: fullName,
        role: role,
        emailVerified: emailVerified,
        defaultCurrency: defaultCurrency,
        phone: phone,
        paymentHandle: paymentHandle,
        avatarUrl: avatarUrl,
        profileSetupCompletedAt: profileSetupCompletedAt == null
            ? null
            : DateTime.tryParse(profileSetupCompletedAt!),
      );
}

class UpdateProfileRequestModel {
  const UpdateProfileRequestModel({
    required this.fullName,
    this.phone,
    this.paymentHandle,
    this.defaultCurrency,
    this.completeSetup,
  });

  final String fullName;
  final String? phone;
  final String? paymentHandle;
  final String? defaultCurrency;
  final bool? completeSetup;

  Map<String, dynamic> toJson() => {
        'fullName': fullName,
        if (phone != null) 'phone': phone,
        if (paymentHandle != null) 'paymentHandle': paymentHandle,
        if (defaultCurrency != null) 'defaultCurrency': defaultCurrency,
        if (completeSetup != null) 'completeSetup': completeSetup,
      };
}
