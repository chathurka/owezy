abstract final class StorageKeys {
  static const String accessToken = 'access_token';
  static const String refreshToken = 'refresh_token';

  // Route name used by SessionService.signOut() for navigation after logout.
  // Updated to the actual auth route name when the auth feature ships.
  static const String loginRoute = '/login';
}
