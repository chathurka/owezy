import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';

import '../../core/network/api_client.dart';
import '../../core/network/dio_client.dart';
import '../../core/session/session_service.dart';
import '../../core/storage/secure_storage_service.dart';

/// Registers core singletons that must be available before any feature runs.
/// Feature-specific bindings are added in each GetPage's binding.
class InitialBinding extends Bindings {
  @override
  void dependencies() {
    // Storage (registered first — other services depend on it)
    Get.lazyPut<SecureStorageService>(
      () => const SecureStorageService(FlutterSecureStorage()),
      fenix: true,
    );

    // Networking (depends on storage for Bearer token injection)
    Get.lazyPut<Dio>(
      () => createAppDio(Get.find<SecureStorageService>()),
      fenix: true,
    );
    Get.lazyPut<ApiClient>(
      () => ApiClient(Get.find()),
      fenix: true,
    );

    // ThemeController is put in main() before runApp (needed for themeMode).

    // Session must be ready for AuthMiddleware before the first route builds.
    Get.put<SessionService>(
      SessionService(Get.find<SecureStorageService>()),
      permanent: true,
    );
    Get.find<SessionService>().restore();
  }
}
