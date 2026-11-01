import 'package:flutter_dotenv/flutter_dotenv.dart';

/// The active flavor, set by `flutter run/build --flavor <env>`.
/// Flutter passes this as a dart-define named FLUTTER_APP_FLAVOR automatically.
const String appFlavor = String.fromEnvironment(
  'FLUTTER_APP_FLAVOR',
  defaultValue: 'dev',
);

abstract final class EnvConfig {
  static Future<void> initialize(String flavor) async {
    await dotenv.load(fileName: 'env/.env.$flavor');
  }

  static String get baseUrl => dotenv.env['BASE_URL']!;

  static bool get enableLogging => dotenv.env['ENABLE_LOGGING'] == 'true';

  static Duration get connectTimeout =>
      Duration(milliseconds: int.parse(dotenv.env['CONNECT_TIMEOUT_MS']!));

  static Duration get receiveTimeout =>
      Duration(milliseconds: int.parse(dotenv.env['RECEIVE_TIMEOUT_MS']!));
}
