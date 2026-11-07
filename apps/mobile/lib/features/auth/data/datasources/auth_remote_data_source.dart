import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../../../../core/network/base_response.dart';
import '../models/login_models.dart';
import '../models/register_models.dart';

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
}
