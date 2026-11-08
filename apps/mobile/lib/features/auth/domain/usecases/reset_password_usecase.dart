import '../repositories/auth_repository.dart';

class ResetPasswordUseCase {
  const ResetPasswordUseCase(this._repository);

  final AuthRepository _repository;

  Future<void> call({required String token, required String password}) =>
      _repository.resetPassword(
        ResetPasswordParams(token: token, password: password),
      );
}
