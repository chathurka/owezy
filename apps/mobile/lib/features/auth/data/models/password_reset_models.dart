import 'package:json_annotation/json_annotation.dart';

part 'password_reset_models.g.dart';

@JsonSerializable()
class ForgotPasswordRequestModel {
  const ForgotPasswordRequestModel({required this.email});

  final String email;

  Map<String, dynamic> toJson() => _$ForgotPasswordRequestModelToJson(this);
}

@JsonSerializable()
class ResetPasswordRequestModel {
  const ResetPasswordRequestModel({
    required this.token,
    required this.password,
  });

  final String token;
  final String password;

  Map<String, dynamic> toJson() => _$ResetPasswordRequestModelToJson(this);
}

@JsonSerializable()
class ResetPasswordResponseModel {
  const ResetPasswordResponseModel({required this.ok});

  final bool ok;

  factory ResetPasswordResponseModel.fromJson(Map<String, dynamic> json) =>
      _$ResetPasswordResponseModelFromJson(json);
}
