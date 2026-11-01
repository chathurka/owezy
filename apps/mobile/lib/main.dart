import 'package:flutter/material.dart';

import 'app/app.dart';
import 'core/config/env_config.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EnvConfig.initialize(appFlavor);
  runApp(const OwezyApp());
}
