import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:owezy_mobile/features/groups/data/datasources/groups_remote_data_source.dart';
import 'package:owezy_mobile/features/groups/presentation/controllers/create_group_controller.dart';
import 'package:owezy_mobile/l10n/app_localizations.dart';

class _FakeRemote extends GroupsRemoteDataSource {
  _FakeRemote() : super(Dio());

  String? lastId;
  int createCount = 0;

  @override
  Future<GroupModel> create({required String id, required String name}) async {
    createCount += 1;
    lastId = id;
    return GroupModel(
      id: id,
      name: name,
      inviteCode: 'ABCD1234',
      role: 'owner',
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late _FakeRemote remote;
  late CreateGroupController controller;
  late AppLocalizations l10n;

  setUp(() async {
    Get.testMode = true;
    remote = _FakeRemote();
    controller = CreateGroupController(remote);
    l10n = await AppLocalizations.delegate.load(const Locale('en'));
  });

  tearDown(Get.reset);

  test('keeps stable client id across submit retries', () async {
    controller.name.value = 'Trip';
    final firstId = controller.clientId;

    await controller.submit(l10n);
    expect(remote.lastId, firstId);

    await controller.submit(l10n);
    expect(remote.lastId, firstId);
    expect(remote.createCount, 2);
  });

  test('rejects empty name', () async {
    await controller.submit(l10n);
    expect(controller.formError.value, isNotNull);
    expect(remote.createCount, 0);
  });
}
