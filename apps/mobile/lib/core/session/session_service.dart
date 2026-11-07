import 'package:get/get.dart';

import '../../app/routes/app_routes.dart';
import '../storage/secure_storage_service.dart';

/// GetX-based session service.
/// Uses reactive observables instead of ChangeNotifier.
/// Auth-gated navigation is driven by [isAuthenticated].
///
/// Full session validation (calling /v1/auth/me) is added when
/// the auth feature is implemented via /spec-build.
class SessionService extends GetxController {
  SessionService(this._storage);

  final SecureStorageService _storage;

  final _isAuthenticated = false.obs;

  bool get isAuthenticated => _isAuthenticated.value;

  /// Called at app startup. Restores session from secure storage.
  Future<void> restore() async {
    final token = await _storage.getAccessToken();
    _isAuthenticated.value = token != null && token.isNotEmpty;
  }

  /// Call after a successful login or token refresh.
  void setAuthenticated() {
    _isAuthenticated.value = true;
  }

  /// Clears all stored tokens and marks the session as unauthenticated.
  Future<void> signOut() async {
    await _storage.clearTokens();
    _isAuthenticated.value = false;
    Get.offAllNamed(AppRoutes.login);
  }
}
