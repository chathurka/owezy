import 'package:get/get.dart';

import '../../features/home/presentation/bindings/home_binding.dart';
import '../../features/home/presentation/pages/home_page.dart';
import 'app_routes.dart';

abstract final class AppPages {
  static final routes = <GetPage>[
    GetPage(
      name: AppRoutes.initial,
      page: () => const HomePage(),
      binding: HomeBinding(),
      // Auth middleware is added when the auth feature is implemented:
      // middlewares: [AuthMiddleware()],
    ),
    GetPage(
      name: AppRoutes.home,
      page: () => const HomePage(),
      binding: HomeBinding(),
    ),
    // Auth routes and feature routes are registered here via /spec-build.
  ];
}
