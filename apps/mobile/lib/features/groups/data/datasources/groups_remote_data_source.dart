import 'package:dio/dio.dart';

import '../../../../core/network/base_response.dart';

class GroupModel {
  const GroupModel({
    required this.id,
    required this.name,
    required this.inviteCode,
    required this.role,
  });

  final String id;
  final String name;
  final String inviteCode;
  final String role;

  factory GroupModel.fromJson(Map<String, dynamic> json) => GroupModel(
        id: json['id'] as String,
        name: json['name'] as String,
        inviteCode: json['inviteCode'] as String,
        role: json['role'] as String,
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
}
