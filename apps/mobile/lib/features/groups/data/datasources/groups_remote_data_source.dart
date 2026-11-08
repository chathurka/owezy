import 'package:dio/dio.dart';

import '../../../../core/network/base_response.dart';

class GroupModel {
  const GroupModel({
    required this.id,
    required this.name,
    required this.inviteCode,
    required this.role,
    this.memberCount = 1,
  });

  final String id;
  final String name;
  final String inviteCode;
  final String role;
  final int memberCount;

  factory GroupModel.fromJson(Map<String, dynamic> json) => GroupModel(
        id: json['id'] as String,
        name: json['name'] as String,
        inviteCode: json['inviteCode'] as String,
        role: json['role'] as String,
        memberCount: (json['memberCount'] as num?)?.toInt() ?? 1,
      );
}

class GroupOverviewModel {
  const GroupOverviewModel({
    required this.id,
    required this.name,
    required this.inviteCode,
    required this.role,
    required this.memberCount,
    required this.activityEmpty,
  });

  final String id;
  final String name;
  final String inviteCode;
  final String role;
  final int memberCount;
  final bool activityEmpty;

  factory GroupOverviewModel.fromJson(Map<String, dynamic> json) =>
      GroupOverviewModel(
        id: json['id'] as String,
        name: json['name'] as String,
        inviteCode: json['inviteCode'] as String,
        role: json['role'] as String,
        memberCount: (json['memberCount'] as num).toInt(),
        activityEmpty: json['activityEmpty'] as bool? ?? true,
      );
}

class GroupsRemoteDataSource {
  GroupsRemoteDataSource(this._dio);

  final Dio _dio;

  Future<List<GroupModel>> listMine() async {
    final response = await _dio.get<Map<String, dynamic>>('/groups');
    final body = BaseResponse<Map<String, dynamic>>.fromJson(
      response.data ?? const {},
      (Object? json) => json as Map<String, dynamic>,
    );
    final items = (body.data?['items'] as List<dynamic>? ?? const [])
        .map((e) => GroupModel.fromJson(e as Map<String, dynamic>))
        .toList();
    return items;
  }

  Future<GroupOverviewModel> getOverview(String groupId) async {
    final response =
        await _dio.get<Map<String, dynamic>>('/groups/$groupId');
    final body = BaseResponse<GroupOverviewModel>.fromJson(
      response.data ?? const {},
      (Object? json) =>
          GroupOverviewModel.fromJson(json as Map<String, dynamic>),
    );
    return body.data!;
  }

  Future<GroupModel> create({required String id, required String name}) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/groups',
      data: {'id': id, 'name': name},
    );
    final body = BaseResponse<GroupModel>.fromJson(
      response.data ?? const {},
      (Object? json) => GroupModel.fromJson(json as Map<String, dynamic>),
    );
    return body.data!;
  }

  Future<GroupModel> join({required String inviteCode}) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/groups/join',
      data: {'inviteCode': inviteCode},
    );
    final body = BaseResponse<GroupModel>.fromJson(
      response.data ?? const {},
      (Object? json) => GroupModel.fromJson(json as Map<String, dynamic>),
    );
    return body.data!;
  }

  Future<Map<String, dynamic>> createInvitation({
    required String groupId,
    required String id,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/groups/$groupId/invitations',
      data: {'id': id},
    );
    final body = BaseResponse<Map<String, dynamic>>.fromJson(
      response.data ?? const {},
      (Object? json) => json as Map<String, dynamic>,
    );
    return body.data!;
  }

  Future<GroupModel> acceptInvitation({required String token}) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/invitations/accept',
      data: {'token': token},
    );
    final body = BaseResponse<GroupModel>.fromJson(
      response.data ?? const {},
      (Object? json) => GroupModel.fromJson(json as Map<String, dynamic>),
    );
    return body.data!;
  }

  Future<List<Map<String, dynamic>>> listMembers(String groupId) async {
    final response =
        await _dio.get<Map<String, dynamic>>('/groups/$groupId/members');
    final body = BaseResponse<Map<String, dynamic>>.fromJson(
      response.data ?? const {},
      (Object? json) => json as Map<String, dynamic>,
    );
    return (body.data?['items'] as List<dynamic>? ?? const [])
        .cast<Map<String, dynamic>>();
  }
}
