import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import 'base_response.dart';

part 'api_client.g.dart';

/// Central Retrofit API client.
/// Feature-specific endpoints are added here as each feature is implemented via /spec-build.
///
/// Example (auth feature):
/// @POST('/auth/login')
/// Future<BaseResponse<TokensModel>> login(@Body() LoginRequestDto body);
@RestApi()
abstract class ApiClient {
  factory ApiClient(Dio dio, {String? baseUrl}) = _ApiClient;
}
