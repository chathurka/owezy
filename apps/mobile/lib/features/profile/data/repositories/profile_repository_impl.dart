import '../../../../core/network/safe_api_call.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/repositories/profile_repository.dart';
import '../datasources/profile_remote_data_source.dart';
import '../models/profile_models.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  ProfileRepositoryImpl(this._remote);

  final ProfileRemoteDataSource _remote;

  @override
  Future<UserProfile> getMe() async {
    final model = await safeApiCall(() => _remote.getMe());
    return model.toEntity();
  }

  @override
  Future<UserProfile> updateMe(UpdateProfileParams params) async {
    final model = await safeApiCall(
      () => _remote.updateMe(
        UpdateProfileRequestModel(
          fullName: params.fullName,
          phone: params.phone,
          paymentHandle: params.paymentHandle,
          defaultCurrency: params.defaultCurrency,
          preferredLocale: params.preferredLocale,
          completeSetup: params.completeSetup,
          completeGroupOnboarding: params.completeGroupOnboarding,
        ),
      ),
    );
    return model.toEntity();
  }
}
