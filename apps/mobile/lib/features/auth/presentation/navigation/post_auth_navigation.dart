import 'package:get/get.dart';

import '../../../../app/routes/app_routes.dart';
import '../../domain/entities/auth_session.dart';

void navigateAfterAuth(AuthUser user) {
  if (user.needsProfileSetup) {
    Get.offAllNamed(AppRoutes.profileSetup);
  } else {
    Get.offAllNamed(AppRoutes.home);
  }
}
