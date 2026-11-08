import '../entities/user_profile.dart';

abstract class ProfileRepository {
  Future<UserProfile> getMe();

  Future<UserProfile> updateMe(UpdateProfileParams params);
}
