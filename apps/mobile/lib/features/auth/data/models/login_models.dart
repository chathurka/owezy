import 'package:json_annotation/json_annotation.dart';

import '../../domain/entities/auth_session.dart';
import 'register_models.dart';

part 'login_models.g.dart';

@JsonSerializable()
class LoginRequestModel {
  const LoginRequestModel({
    required this.email,
    required this.password,
  });

  final String email;
  final String password;

  factory LoginRequestModel.fromParams(LoginParams params) {
    return LoginRequestModel(
      email: params.email,
      password: params.password,
    );
  }

  Map<String, dynamic> toJson() => _$LoginRequestModelToJson(this);
}

@JsonSerializable()
class LoginResponseModel {
  const LoginResponseModel({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  final String accessToken;
  final String refreshToken;
  final AuthUserModel user;

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) =>
      _$LoginResponseModelFromJson(json);

  AuthSession toEntity() => AuthSession(
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user.toEntity(),
        emailVerificationRequired: !user.emailVerified,
      );
}
