import 'dart:async';

import 'package:dio/dio.dart';
import 'package:get/get.dart';

import '../../../app/routes/app_routes.dart';
import '../../session/session_service.dart';
import '../../storage/secure_storage_service.dart';

/// On 401, attempts a single refresh via `/auth/refresh`.
/// On refresh failure, clears the session and navigates to login.
class AuthRefreshInterceptor extends QueuedInterceptor {
  AuthRefreshInterceptor(this._storage, this._dio);

  final SecureStorageService _storage;
  final Dio _dio;

  static const _retriedExtraKey = 'owezy_auth_retried';

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final status = err.response?.statusCode;
    final alreadyRetried = err.requestOptions.extra[_retriedExtraKey] == true;
    final isRefreshCall =
        err.requestOptions.path.contains('/auth/refresh') ||
        err.requestOptions.path.contains('/auth/login') ||
        err.requestOptions.path.contains('/auth/register') ||
        err.requestOptions.path.contains('/auth/apple') ||
        err.requestOptions.path.contains('/auth/logout');

    if (status != 401 || alreadyRetried || isRefreshCall) {
      return handler.next(err);
    }

    final refreshToken = await _storage.getRefreshToken();
    if (refreshToken == null || refreshToken.isEmpty) {
      await _forceSignOut();
      return handler.next(err);
    }

    try {
      final refreshResponse = await _dio.post<Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
        options: Options(
          extra: {_retriedExtraKey: true},
          headers: {'Authorization': null},
        ),
      );

      final data = refreshResponse.data?['data'] as Map<String, dynamic>?;
      final accessToken = data?['accessToken'] as String?;
      final newRefresh = data?['refreshToken'] as String?;
      if (accessToken == null ||
          accessToken.isEmpty ||
          newRefresh == null ||
          newRefresh.isEmpty) {
        await _forceSignOut();
        return handler.next(err);
      }

      await _storage.setAccessToken(accessToken);
      await _storage.setRefreshToken(newRefresh);
      if (Get.isRegistered<SessionService>()) {
        Get.find<SessionService>().setAuthenticated();
      }

      final request = err.requestOptions;
      request.headers['Authorization'] = 'Bearer $accessToken';
      request.extra[_retriedExtraKey] = true;
      final response = await _dio.fetch<dynamic>(request);
      return handler.resolve(response);
    } catch (_) {
      await _forceSignOut();
      return handler.next(err);
    }
  }

  Future<void> _forceSignOut() async {
    await _storage.clearTokens();
    if (Get.isRegistered<SessionService>()) {
      final session = Get.find<SessionService>();
      // Avoid recursive Get.offAllNamed loops during interceptor.
      session.markUnauthenticated();
    }
    if (Get.key.currentState != null) {
      Get.offAllNamed(
        AppRoutes.login,
        parameters: {'reason': 'session-expired'},
      );
    }
  }
}
