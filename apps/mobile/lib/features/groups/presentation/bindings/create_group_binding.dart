import 'package:dio/dio.dart';
import 'package:get/get.dart';

import '../../data/datasources/groups_remote_data_source.dart';
import '../controllers/create_group_controller.dart';

class CreateGroupBinding extends Bindings {
  @override
  void dependencies() {
    if (!Get.isRegistered<GroupsRemoteDataSource>()) {
      Get.lazyPut(
        () => GroupsRemoteDataSource(Get.find<Dio>()),
        fenix: true,
      );
    }
    Get.lazyPut(
      () => CreateGroupController(Get.find<GroupsRemoteDataSource>()),
    );
  }
}
