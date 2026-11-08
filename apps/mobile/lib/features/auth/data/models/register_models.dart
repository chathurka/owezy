import 'package:json_annotation/json_annotation.dart';

import '../../domain/entities/auth_session.dart';

part 'register_models.g.dart';

@JsonSerializable()
class RegisterRequestModel {
  const RegisterRequestModel({
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

  factory RegisterRequestModel.fromParams(RegisterParams params) {
    return RegisterRequestModel(
      fullName: params.fullName,
      email: params.email,
      password: params.password,
      defaultCurrency: params.defaultCurrency,
      acceptedTerms: params.acceptedTerms,
    );
  }

  Map<String, dynamic> toJson() => _$RegisterRequestModelToJson(this);
}

@JsonSerializable()
class AuthUserModel {
  const AuthUserModel({
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

  factory AuthUserModel.fromJson(Map<String, dynamic> json) =>
      _$AuthUserModelFromJson(json);

  AuthUser toEntity() => AuthUser(
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

@JsonSerializable()
class RegisterResponseModel {
  const RegisterResponseModel({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
    required this.emailVerificationRequired,
  });

  final String accessToken;
  final String refreshToken;
  final AuthUserModel user;
  final bool emailVerificationRequired;

  factory RegisterResponseModel.fromJson(Map<String, dynamic> json) =>
      _$RegisterResponseModelFromJson(json);

  AuthSession toEntity() => AuthSession(
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user.toEntity(),
        emailVerificationRequired: emailVerificationRequired,
      );
}
