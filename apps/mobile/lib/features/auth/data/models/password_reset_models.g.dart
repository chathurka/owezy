// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'password_reset_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ForgotPasswordRequestModel _$ForgotPasswordRequestModelFromJson(
        Map<String, dynamic> json) =>
    ForgotPasswordRequestModel(
      email: json['email'] as String,
    );

Map<String, dynamic> _$ForgotPasswordRequestModelToJson(
        ForgotPasswordRequestModel instance) =>
    <String, dynamic>{
      'email': instance.email,
    };

ResetPasswordRequestModel _$ResetPasswordRequestModelFromJson(
        Map<String, dynamic> json) =>
    ResetPasswordRequestModel(
      token: json['token'] as String,
      password: json['password'] as String,
    );

Map<String, dynamic> _$ResetPasswordRequestModelToJson(
        ResetPasswordRequestModel instance) =>
    <String, dynamic>{
      'token': instance.token,
      'password': instance.password,
    };

ResetPasswordResponseModel _$ResetPasswordResponseModelFromJson(
        Map<String, dynamic> json) =>
    ResetPasswordResponseModel(
      ok: json['ok'] as bool,
    );

Map<String, dynamic> _$ResetPasswordResponseModelToJson(
        ResetPasswordResponseModel instance) =>
    <String, dynamic>{
      'ok': instance.ok,
    };
