import 'package:json_annotation/json_annotation.dart';

import '../../domain/repositories/auth_repository.dart';

part 'verify_email_models.g.dart';

@JsonSerializable()
class VerifyEmailRequestModel {
  const VerifyEmailRequestModel({required this.token});

  final String token;

  Map<String, dynamic> toJson() => _$VerifyEmailRequestModelToJson(this);
}

@JsonSerializable()
class VerifyEmailResponseModel {
  const VerifyEmailResponseModel({
    required this.email,
    required this.emailVerified,
  });

  final String email;
  final bool emailVerified;

  factory VerifyEmailResponseModel.fromJson(Map<String, dynamic> json) =>
      _$VerifyEmailResponseModelFromJson(json);

  VerifyEmailResult toEntity() => VerifyEmailResult(
        email: email,
        emailVerified: emailVerified,
      );
}

@JsonSerializable()
class ResendVerificationRequestModel {
  const ResendVerificationRequestModel({required this.email});

  final String email;

  Map<String, dynamic> toJson() => _$ResendVerificationRequestModelToJson(this);
}
