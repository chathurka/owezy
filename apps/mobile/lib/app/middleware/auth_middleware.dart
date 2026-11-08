import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

import '../../core/session/session_service.dart';
import '../routes/app_routes.dart';

/// Redirects unauthenticated users away from protected routes.
class AuthMiddleware extends GetMiddleware {
  @override
  RouteSettings? redirect(String? route) {
    final session = Get.find<SessionService>();
    if (!session.isAuthenticated) {
      return const RouteSettings(name: AppRoutes.welcome);
    }
    return null;
  }
}
