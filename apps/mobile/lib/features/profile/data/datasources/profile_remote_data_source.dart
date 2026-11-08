import 'package:dio/dio.dart';

import '../../../../core/network/base_response.dart';
import '../models/profile_models.dart';

class ProfileRemoteDataSource {
  ProfileRemoteDataSource(this._dio);

  final Dio _dio;

  Future<UserProfileModel> getMe() async {
    final response = await _dio.get<Map<String, dynamic>>('/users/me');
    final body = BaseResponse<UserProfileModel>.fromJson(
      response.data ?? const {},
      (Object? json) =>
          UserProfileModel.fromJson(json as Map<String, dynamic>),
    );
    final data = body.data;
    if (data == null) {
      throw DioException(
        requestOptions: response.requestOptions,
        message: 'Missing profile payload',
      );
    }
    return data;
  }

  Future<UserProfileModel> updateMe(UpdateProfileRequestModel body) async {
    final response = await _dio.patch<Map<String, dynamic>>(
      '/users/me',
      data: body.toJson(),
    );
    final parsed = BaseResponse<UserProfileModel>.fromJson(
      response.data ?? const {},
      (Object? json) =>
          UserProfileModel.fromJson(json as Map<String, dynamic>),
    );
    final data = parsed.data;
    if (data == null) {
      throw DioException(
        requestOptions: response.requestOptions,
        message: 'Missing profile payload',
      );
    }
    return data;
  }
}
