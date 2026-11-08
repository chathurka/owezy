import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Active env. Prefer `--dart-define=APP_FLAVOR=<env>`.
/// When using native `--flavor`, Flutter also sets `FLUTTER_APP_FLAVOR`.
const String appFlavor = String.fromEnvironment(
  'APP_FLAVOR',
  defaultValue: String.fromEnvironment(
    'FLUTTER_APP_FLAVOR',
    defaultValue: 'dev',
  ),
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

  /// Web OAuth client ID used as `serverClientId` so Google returns a
  /// verifiable ID token for the Nest API (ADR-0008).
  static String get googleServerClientId =>
      dotenv.env['GOOGLE_SERVER_CLIENT_ID'] ?? '';
}
