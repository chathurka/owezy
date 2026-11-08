import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../../../../core/network/base_response.dart';
import '../models/apple_sign_in_models.dart';
import '../models/login_models.dart';
import '../models/password_reset_models.dart';
import '../models/register_models.dart';
import '../models/verify_email_models.dart';

part 'auth_remote_data_source.g.dart';

@RestApi()
abstract class AuthRemoteDataSource {
  factory AuthRemoteDataSource(Dio dio, {String? baseUrl}) = _AuthRemoteDataSource;

  @POST('/auth/register')
  Future<BaseResponse<RegisterResponseModel>> register(
    @Body() RegisterRequestModel body,
  );

  @POST('/auth/login')
  Future<BaseResponse<LoginResponseModel>> login(
    @Body() LoginRequestModel body,
  );

  @POST('/auth/apple')
  Future<BaseResponse<LoginResponseModel>> signInWithApple(
    @Body() AppleSignInRequestModel body,
  );

  @POST('/auth/email/verify')
  Future<BaseResponse<VerifyEmailResponseModel>> verifyEmail(
    @Body() VerifyEmailRequestModel body,
  );

  @POST('/auth/email/resend')
  Future<void> resendVerification(
    @Body() ResendVerificationRequestModel body,
  );

  @POST('/auth/password/forgot')
  Future<void> forgotPassword(
    @Body() ForgotPasswordRequestModel body,
  );

  @POST('/auth/password/reset')
  Future<BaseResponse<ResetPasswordResponseModel>> resetPassword(
    @Body() ResetPasswordRequestModel body,
  );
}
