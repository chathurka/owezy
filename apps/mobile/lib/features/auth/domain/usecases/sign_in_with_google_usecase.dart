import '../google_auth_gateway.dart';
import '../entities/auth_session.dart';
import '../repositories/auth_repository.dart';

class SignInWithGoogleUseCase {
  SignInWithGoogleUseCase(this._googleAuth, this._repository);

  final GoogleAuthGateway _googleAuth;
  final AuthRepository _repository;

  /// Returns null when the user cancels the Google sheet.
  Future<AuthSession?> call() async {
    final credential = await _googleAuth.requestCredential();
    if (credential == null) {
      return null;
    }

    return _repository.signInWithGoogle(
      GoogleSignInParams(
        idToken: credential.idToken,
        email: credential.email,
        fullName: credential.fullName,
      ),
    );
  }
}
