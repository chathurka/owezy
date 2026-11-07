import 'package:flutter/material.dart';
import 'package:get/get.dart';

/// Controls the app-wide [ThemeMode].
///
/// Registered as a permanent singleton in `main()` before `runApp`
/// (so [GetMaterialApp.themeMode] can resolve it during first build).
/// Default: [ThemeMode.system] — follows OS preference.
///
/// The Profile / Preferences screen calls [setMode] or [toggleDarkMode] to
/// let users pick an explicit theme. Persistence across restarts is deferred
/// until the Profile feature; for now the preference is in-memory only.
///
/// Usage:
/// ```dart
/// // In a widget:
/// Get.find<ThemeController>().setMode(ThemeMode.dark);
///
/// // Reactive read (e.g., for a switch widget):
/// Obx(() => Switch(
///   value: Get.find<ThemeController>().isDark,
///   onChanged: (v) => Get.find<ThemeController>().toggleDarkMode(v),
/// ))
/// ```
class ThemeController extends GetxController {
  final _mode = ThemeMode.system.obs;

  /// Current [ThemeMode] (system / light / dark).
  ThemeMode get themeMode => _mode.value;

  /// Whether the app is currently rendering in dark mode.
  /// Takes [ThemeMode.system] into account via platform brightness.
  bool get isDark {
    if (_mode.value == ThemeMode.system) {
      return WidgetsBinding
              .instance.platformDispatcher.platformBrightness ==
          Brightness.dark;
    }
    return _mode.value == ThemeMode.dark;
  }

  /// Sets the theme mode and notifies [GetMaterialApp].
  void setMode(ThemeMode mode) {
    _mode.value = mode;
    Get.changeThemeMode(mode);
  }

  /// Convenience toggle for a Switch widget.
  void toggleDarkMode(bool dark) =>
      setMode(dark ? ThemeMode.dark : ThemeMode.light);

  /// Resets to system default.
  void useSystemTheme() => setMode(ThemeMode.system);
}
