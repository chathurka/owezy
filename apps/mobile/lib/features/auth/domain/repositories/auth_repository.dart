import '../entities/auth_session.dart';

class AppleSignInParams {
  const AppleSignInParams({
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

abstract class AuthRepository {
  Future<AuthSession> register(RegisterParams params);

  Future<AuthSession> login(LoginParams params);

  Future<AuthSession> signInWithApple(AppleSignInParams params);
}
