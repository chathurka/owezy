import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

import '../config/env_config.dart';
import '../storage/secure_storage_service.dart';
import 'interceptors/auth_refresh_interceptor.dart';
import 'interceptors/error_interceptor.dart';
import 'interceptors/request_interceptor.dart';
import 'interceptors/response_interceptor.dart';

Dio createAppDio(SecureStorageService storage) {
  final dio = Dio(
    BaseOptions(
      baseUrl: EnvConfig.baseUrl,
      connectTimeout: EnvConfig.connectTimeout,
      receiveTimeout: EnvConfig.receiveTimeout,
    ),
  );

  dio.interceptors.addAll([
    RequestInterceptor(storage),
    AuthRefreshInterceptor(storage, dio),
    ResponseInterceptor(),
    ErrorInterceptor(),
    if (EnvConfig.enableLogging)
      PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        error: true,
        compact: false,
      ),
  ]);

  return dio;
}
