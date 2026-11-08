import '../../../../core/network/safe_api_call.dart';
import '../../../../core/session/session_service.dart';
import '../../../../core/storage/secure_storage_service.dart';
import '../../domain/entities/auth_session.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/apple_sign_in_models.dart';
import '../models/login_models.dart';
import '../models/password_reset_models.dart';
import '../models/register_models.dart';
import '../models/verify_email_models.dart';

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
    await _persistSession(session);
    return session;
  }

  @override
  Future<AuthSession> login(LoginParams params) async {
    final response = await safeApiCall(
      () => _remote.login(LoginRequestModel.fromParams(params)),
    );
    final data = response.data;
    if (data == null) {
      throw StateError('Login response missing data');
    }

    final session = data.toEntity();
    await _persistSession(session);
    return session;
  }

  @override
  Future<AuthSession> signInWithApple(AppleSignInParams params) async {
    final response = await safeApiCall(
      () => _remote.signInWithApple(
        AppleSignInRequestModel(
          identityToken: params.identityToken,
          authorizationCode: params.authorizationCode,
          fullName: params.fullName,
          email: params.email,
        ),
      ),
    );
    final data = response.data;
    if (data == null) {
      throw StateError('Apple sign-in response missing data');
    }

    final session = data.toEntity();
    await _persistSession(session);
    return session;
  }

  @override
  Future<VerifyEmailResult> verifyEmail(VerifyEmailParams params) async {
    final response = await safeApiCall(
      () => _remote.verifyEmail(VerifyEmailRequestModel(token: params.token)),
    );
    final data = response.data;
    if (data == null) {
      throw StateError('Verify email response missing data');
    }
    return data.toEntity();
  }

  @override
  Future<void> resendVerification(ResendVerificationParams params) async {
    await safeApiCall(
      () => _remote.resendVerification(
        ResendVerificationRequestModel(email: params.email),
      ),
    );
  }

  @override
  Future<void> forgotPassword(ForgotPasswordParams params) async {
    await safeApiCall(
      () => _remote.forgotPassword(
        ForgotPasswordRequestModel(email: params.email),
      ),
    );
  }

  @override
  Future<void> resetPassword(ResetPasswordParams params) async {
    await safeApiCall(
      () => _remote.resetPassword(
        ResetPasswordRequestModel(
          token: params.token,
          password: params.password,
        ),
      ),
    );
  }

  Future<void> _persistSession(AuthSession session) async {
    await _storage.setAccessToken(session.accessToken);
    await _storage.setRefreshToken(session.refreshToken);
    _session.setAuthenticated();
  }
}
