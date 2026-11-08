class GoogleCredential {
  const GoogleCredential({
    required this.idToken,
    this.email,
    this.fullName,
  });

  final String idToken;
  final String? email;
  final String? fullName;
}

abstract class GoogleAuthGateway {
  /// Returns null when the user cancels Google Sign-In.
  Future<GoogleCredential?> requestCredential();
}
