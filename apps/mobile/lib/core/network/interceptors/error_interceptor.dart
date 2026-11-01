import 'package:dio/dio.dart';

import '../../errors/api_exception.dart';

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    handler.next(
      DioException(
        requestOptions: err.requestOptions,
        error: ApiException.fromDioException(err),
        response: err.response,
        type: err.type,
      ),
    );
  }
}
