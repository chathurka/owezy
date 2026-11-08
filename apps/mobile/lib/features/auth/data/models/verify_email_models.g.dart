// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_email_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VerifyEmailRequestModel _$VerifyEmailRequestModelFromJson(
        Map<String, dynamic> json) =>
    VerifyEmailRequestModel(
      token: json['token'] as String,
    );

Map<String, dynamic> _$VerifyEmailRequestModelToJson(
        VerifyEmailRequestModel instance) =>
    <String, dynamic>{
      'token': instance.token,
    };

VerifyEmailResponseModel _$VerifyEmailResponseModelFromJson(
        Map<String, dynamic> json) =>
    VerifyEmailResponseModel(
      email: json['email'] as String,
      emailVerified: json['emailVerified'] as bool,
    );

Map<String, dynamic> _$VerifyEmailResponseModelToJson(
        VerifyEmailResponseModel instance) =>
    <String, dynamic>{
      'email': instance.email,
      'emailVerified': instance.emailVerified,
    };

ResendVerificationRequestModel _$ResendVerificationRequestModelFromJson(
        Map<String, dynamic> json) =>
    ResendVerificationRequestModel(
      email: json['email'] as String,
    );

Map<String, dynamic> _$ResendVerificationRequestModelToJson(
        ResendVerificationRequestModel instance) =>
    <String, dynamic>{
      'email': instance.email,
    };
