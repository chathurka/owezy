import 'package:dio/dio.dart';
import 'package:get/get.dart';

import '../../../../core/session/session_service.dart';
import '../../../../core/storage/secure_storage_service.dart';
import '../../data/apple_auth_gateway_impl.dart';
import '../../data/datasources/auth_remote_data_source.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/apple_auth_gateway.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/usecases/register_usecase.dart';
import '../../domain/usecases/sign_in_with_apple_usecase.dart';
import '../controllers/register_controller.dart';

class RegisterBinding extends Bindings {
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
    Get.lazyPut<AppleAuthGateway>(
      () => AppleAuthGatewayImpl(),
      fenix: true,
    );
    Get.lazyPut(() => RegisterUseCase(Get.find<AuthRepository>()), fenix: true);
    Get.lazyPut(
      () => SignInWithAppleUseCase(
        Get.find<AppleAuthGateway>(),
        Get.find<AuthRepository>(),
      ),
      fenix: true,
    );
    Get.lazyPut(
      () => RegisterController(
        Get.find<RegisterUseCase>(),
        Get.find<SignInWithAppleUseCase>(),
      ),
    );
  }
}
