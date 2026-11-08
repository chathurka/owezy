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

class GoogleSignInParams {
  const GoogleSignInParams({
    required this.idToken,
    this.email,
    this.fullName,
  });

  final String idToken;
  final String? email;
  final String? fullName;
}

class VerifyEmailParams {
  const VerifyEmailParams({required this.token});
  final String token;
}

class VerifyEmailResult {
  const VerifyEmailResult({required this.email, required this.emailVerified});
  final String email;
  final bool emailVerified;
}

class ResendVerificationParams {
  const ResendVerificationParams({required this.email});
  final String email;
}

class ForgotPasswordParams {
  const ForgotPasswordParams({required this.email});
  final String email;
}

class ResetPasswordParams {
  const ResetPasswordParams({required this.token, required this.password});
  final String token;
  final String password;
}

abstract class AuthRepository {
  Future<AuthSession> register(RegisterParams params);

  Future<AuthSession> login(LoginParams params);

  Future<AuthSession> signInWithApple(AppleSignInParams params);

  Future<AuthSession> signInWithGoogle(GoogleSignInParams params);

  Future<VerifyEmailResult> verifyEmail(VerifyEmailParams params);

  Future<void> resendVerification(ResendVerificationParams params);

  Future<void> forgotPassword(ForgotPasswordParams params);

  Future<void> resetPassword(ResetPasswordParams params);
}
