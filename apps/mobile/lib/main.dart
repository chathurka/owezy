import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'app/app.dart';
import 'core/config/env_config.dart';
import 'core/theme/theme_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EnvConfig.initialize(appFlavor);
  // Must be registered before OwezyApp builds — GetMaterialApp.themeMode
  // calls Get.find in the constructor args, which runs before initialBinding.
  Get.put<ThemeController>(ThemeController(), permanent: true);
  runApp(const OwezyApp());
}
