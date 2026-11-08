import 'package:dio/dio.dart';
import 'package:get/get.dart';

import '../../data/datasources/profile_remote_data_source.dart';
import '../../data/repositories/profile_repository_impl.dart';
import '../../domain/repositories/profile_repository.dart';
import '../../domain/usecases/get_profile_usecase.dart';
import '../../domain/usecases/update_profile_usecase.dart';
import '../controllers/profile_controller.dart';

class ProfileBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(
      () => ProfileRemoteDataSource(Get.find<Dio>()),
      fenix: true,
    );
    Get.lazyPut<ProfileRepository>(
      () => ProfileRepositoryImpl(Get.find<ProfileRemoteDataSource>()),
      fenix: true,
    );
    Get.lazyPut(() => GetProfileUseCase(Get.find<ProfileRepository>()), fenix: true);
    Get.lazyPut(
      () => UpdateProfileUseCase(Get.find<ProfileRepository>()),
      fenix: true,
    );
    Get.lazyPut(
      () => ProfileController(
        Get.find<GetProfileUseCase>(),
        Get.find<UpdateProfileUseCase>(),
      ),
    );
  }
}
