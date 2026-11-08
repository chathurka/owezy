import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/features/groups/data/datasources/groups_remote_data_source.dart';
import 'package:owezy_mobile/features/groups/presentation/controllers/group_overview_controller.dart';

class _FakeRemote extends GroupsRemoteDataSource {
  _FakeRemote() : super(Dio());

  @override
  Future<GroupOverviewModel> getOverview(String groupId) async {
    if (groupId == 'missing') {
      throw DioException(requestOptions: RequestOptions(path: '/'));
    }
    return GroupOverviewModel(
      id: groupId,
      name: 'Trip',
      inviteCode: 'ABCD1234',
      role: 'owner',
      memberCount: 2,
      activityEmpty: true,
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late GroupOverviewController controller;

  setUp(() {
    Get.testMode = true;
    Get.parameters['id'] = '11111111-1111-4111-8111-111111111111';
    controller = GroupOverviewController(_FakeRemote());
  });

  tearDown(Get.reset);

  test('loads overview for member group', () async {
    await controller.load();
    expect(controller.overview.value?.name, 'Trip');
    expect(controller.overview.value?.activityEmpty, isTrue);
    expect(controller.error.value, isNull);
  });
}
