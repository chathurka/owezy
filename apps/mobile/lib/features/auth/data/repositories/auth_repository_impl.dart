import '../../../../core/network/safe_api_call.dart';
import '../../../../core/session/session_service.dart';
import '../../../../core/storage/secure_storage_service.dart';
import '../../domain/entities/auth_session.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/register_models.dart';

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl(
    this._remote,
    this._storage,
    this._session,
  );

  final AuthRemoteDataSource _remote;
  final SecureStorageService _storage;
  final SessionService _session;

  @override
  Future<AuthSession> register(RegisterParams params) async {
    final response = await safeApiCall(
      () => _remote.register(RegisterRequestModel.fromParams(params)),
    );
    final data = response.data;
    if (data == null) {
      throw StateError('Register response missing data');
    }

    final session = data.toEntity();
    await _storage.setAccessToken(session.accessToken);
    await _storage.setRefreshToken(session.refreshToken);
    _session.setAuthenticated();
    return session;
  }
}
