import '../entities/auth_session.dart';

abstract class AuthRepository {
  Future<AuthSession> register(RegisterParams params);
}
