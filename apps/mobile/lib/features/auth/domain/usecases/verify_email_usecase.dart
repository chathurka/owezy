import '../repositories/auth_repository.dart';

class VerifyEmailUseCase {
  const VerifyEmailUseCase(this._repository);

  final AuthRepository _repository;

  Future<VerifyEmailResult> call(String token) {
    return _repository.verifyEmail(VerifyEmailParams(token: token));
  }
}

class ResendVerificationUseCase {
  const ResendVerificationUseCase(this._repository);

  final AuthRepository _repository;

  Future<void> call(String email) {
    return _repository.resendVerification(ResendVerificationParams(email: email));
  }
}
