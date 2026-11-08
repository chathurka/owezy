// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'register_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Map<String, dynamic> _$RegisterRequestModelToJson(
  RegisterRequestModel instance,
) => <String, dynamic>{
  'fullName': instance.fullName,
  'email': instance.email,
  'password': instance.password,
  'defaultCurrency': instance.defaultCurrency,
  'acceptedTerms': instance.acceptedTerms,
};

AuthUserModel _$AuthUserModelFromJson(Map<String, dynamic> json) =>
    AuthUserModel(
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
      preferredLocale: json['preferredLocale'] as String?,
    );

RegisterResponseModel _$RegisterResponseModelFromJson(
  Map<String, dynamic> json,
) => RegisterResponseModel(
  accessToken: json['accessToken'] as String,
  refreshToken: json['refreshToken'] as String,
  user: AuthUserModel.fromJson(json['user'] as Map<String, dynamic>),
  emailVerificationRequired: json['emailVerificationRequired'] as bool,
);
