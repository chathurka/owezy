class AppleCredential {
  const AppleCredential({
    required this.identityToken,
    this.authorizationCode,
    this.email,
    this.fullName,
  });

  final String identityToken;
  final String? authorizationCode;
  final String? email;
  final String? fullName;
}

abstract class AppleAuthGateway {
  Future<AppleCredential?> requestCredential();
}
