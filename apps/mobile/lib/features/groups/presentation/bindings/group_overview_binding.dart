import 'package:dio/dio.dart';
import 'package:get/get.dart';

import '../../data/datasources/groups_remote_data_source.dart';
import '../controllers/group_overview_controller.dart';

class GroupOverviewBinding extends Bindings {
  @override
  void dependencies() {
    if (!Get.isRegistered<GroupsRemoteDataSource>()) {
      Get.lazyPut(
        () => GroupsRemoteDataSource(Get.find<Dio>()),
        fenix: true,
      );
    }
    Get.lazyPut(
      () => GroupOverviewController(Get.find<GroupsRemoteDataSource>()),
    );
  }
}
