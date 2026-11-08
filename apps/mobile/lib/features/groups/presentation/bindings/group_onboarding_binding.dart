import 'package:dio/dio.dart';
import 'package:get/get.dart';

import '../../../profile/data/datasources/profile_remote_data_source.dart';
import '../../../profile/data/repositories/profile_repository_impl.dart';
import '../../../profile/domain/repositories/profile_repository.dart';
import '../../../profile/domain/usecases/update_profile_usecase.dart';
import '../../data/datasources/groups_remote_data_source.dart';
import '../controllers/group_onboarding_controller.dart';

class GroupOnboardingBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(
      () => GroupsRemoteDataSource(Get.find<Dio>()),
      fenix: true,
    );
    if (!Get.isRegistered<ProfileRemoteDataSource>()) {
      Get.lazyPut(
        () => ProfileRemoteDataSource(Get.find<Dio>()),
        fenix: true,
      );
    }
    if (!Get.isRegistered<ProfileRepository>()) {
      Get.lazyPut<ProfileRepository>(
        () => ProfileRepositoryImpl(Get.find<ProfileRemoteDataSource>()),
        fenix: true,
      );
    }
    if (!Get.isRegistered<UpdateProfileUseCase>()) {
      Get.lazyPut(
        () => UpdateProfileUseCase(Get.find<ProfileRepository>()),
        fenix: true,
      );
    }
    Get.lazyPut(
      () => GroupOnboardingController(
        Get.find<GroupsRemoteDataSource>(),
        Get.find<UpdateProfileUseCase>(),
      ),
    );
  }
}
