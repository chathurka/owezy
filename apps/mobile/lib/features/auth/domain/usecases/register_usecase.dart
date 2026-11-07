import '../entities/auth_session.dart';
import '../repositories/auth_repository.dart';

class RegisterUseCase {
  RegisterUseCase(this._repository);

  final AuthRepository _repository;

  Future<AuthSession> call(RegisterParams params) => _repository.register(params);
}
