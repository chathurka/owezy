import '../apple_auth_gateway.dart';
import '../entities/auth_session.dart';
import '../repositories/auth_repository.dart';

class SignInWithAppleUseCase {
  SignInWithAppleUseCase(this._appleAuth, this._repository);

  final AppleAuthGateway _appleAuth;
  final AuthRepository _repository;

  /// Returns null when the user cancels the Apple sheet.
  Future<AuthSession?> call() async {
    final credential = await _appleAuth.requestCredential();
    if (credential == null) {
      return null;
    }

    return _repository.signInWithApple(
      AppleSignInParams(
        identityToken: credential.identityToken,
        authorizationCode: credential.authorizationCode,
        email: credential.email,
        fullName: credential.fullName,
      ),
    );
  }
}
