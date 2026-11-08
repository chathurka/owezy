import '../entities/user_profile.dart';
import '../repositories/profile_repository.dart';

class UpdateProfileUseCase {
  UpdateProfileUseCase(this._repository);

  final ProfileRepository _repository;

  Future<UserProfile> call(UpdateProfileParams params) =>
      _repository.updateMe(params);
}
