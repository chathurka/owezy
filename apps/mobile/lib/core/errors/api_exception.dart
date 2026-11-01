import 'package:dio/dio.dart';

class ApiException implements Exception {
  const ApiException({
    required this.title,
    required this.message,
    this.statusCode,
  });

  final String title;
  final String message;
  final int? statusCode;

  factory ApiException.fromDioException(DioException e) {
    return ApiException(
      title: 'Network error',
      message: e.message ?? 'An unexpected network error occurred.',
      statusCode: e.response?.statusCode,
    );
  }

  bool get isUnauthorized => statusCode == 401;
  bool get isNotFound => statusCode == 404;

  @override
  String toString() => 'ApiException($statusCode): $title — $message';
}
