import 'package:dio/dio.dart';
import 'package:get/get.dart';

import '../../../../core/session/session_service.dart';
import '../../../../core/storage/secure_storage_service.dart';
import '../../data/datasources/auth_remote_data_source.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/usecases/forgot_password_usecase.dart';
import '../controllers/forgot_password_controller.dart';

class ForgotPasswordBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AuthRemoteDataSource>(
      () => AuthRemoteDataSource(Get.find<Dio>()),
      fenix: true,
    );
    Get.lazyPut<AuthRepository>(
      () => AuthRepositoryImpl(
        Get.find<AuthRemoteDataSource>(),
        Get.find<SecureStorageService>(),
        Get.find<SessionService>(),
      ),
      fenix: true,
    );
    Get.lazyPut(
      () => ForgotPasswordUseCase(Get.find<AuthRepository>()),
      fenix: true,
    );
    Get.lazyPut(
      () => ForgotPasswordController(Get.find<ForgotPasswordUseCase>()),
    );
  }
}
