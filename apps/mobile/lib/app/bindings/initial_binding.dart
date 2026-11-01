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
      () => SecureStorageService(const FlutterSecureStorage()),
      fenix: true,
    );

    // Networking (depends on storage for Bearer token injection)
    Get.lazyPut(
      () => createAppDio(Get.find<SecureStorageService>()),
      fenix: true,
    );
    Get.lazyPut<ApiClient>(
      () => ApiClient(Get.find()),
      fenix: true,
    );

    // Session (depends on storage; drives auth-gated navigation)
    Get.lazyPut<SessionService>(
      () => SessionService(Get.find<SecureStorageService>()),
      fenix: true,
    );
  }
}
