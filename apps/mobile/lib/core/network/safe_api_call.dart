import 'package:dio/dio.dart';

import '../errors/api_exception.dart';

Future<T> safeApiCall<T>(Future<T> Function() apiCall) async {
  try {
    return await apiCall();
  } on DioException catch (e) {
    if (e.error is ApiException) rethrow;
    throw ApiException.fromDioException(e);
  }
}
