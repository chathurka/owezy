# Owezy Mobile Rules

Source of truth for AI-assisted edits in `apps/mobile/`.

---

## Stack

**GetX** for state management, DI, and routing. **Dio + Retrofit** for networking. **flutter_secure_storage** for JWT tokens.

> GetX replaces BLoC, GetIt, and go_router. See ADR-0004.

---

## Project shape

```text
lib/
  main.dart
  app/
    app.dart                    # GetMaterialApp
    routes/app_routes.dart      # route name constants
    routes/app_pages.dart       # GetPage list
    bindings/initial_binding.dart  # core singleton registration
  l10n/                        # ARB catalogs + generated AppLocalizations
    app_en.arb
    app_*.arb
  core/
    config/    EnvConfig, flavor bootstrap
    constants/ ApiConst, StorageKeys
    network/   Dio factory, Retrofit ApiClient, interceptors, BaseResponse, safeApiCall
    session/   SessionService (GetxController)
    storage/   SecureStorageService
    theme/     AppColors, AppTextStyles, AppSpacing, AppRadius, AppAssets, AppTheme
    errors/    FailureCode, AppException, ApiException, failure_mapper
    widgets/   shared design-system widgets (UI-only, `app_` prefix)
  features/
    <feature_name>/
      injection_container.dart  (optional: only if the feature registers many deps)
      data/
        datasources/  <feature>_remote_data_source.dart  (Retrofit @RestApi)
        models/       <entity>_model.dart                (json_serializable)
        repositories/ <feature>_repository_impl.dart
      domain/
        entities/     <entity>.dart                      (pure Dart, no Flutter imports)
        repositories/ <feature>_repository.dart          (abstract)
        usecases/     <verb>_<object>_usecase.dart
      presentation/
        controllers/  <feature>_controller.dart          (GetxController + .obs)
        pages/        <feature>_page.dart                (GetView<Controller>)
        widgets/      <feature>_<widget>.dart
        bindings/     <feature>_binding.dart             (Bindings)
  shared/
    extensions/
    formatters/
    validators/
```

---

## State management (GetX)

- Use `GetxController` + reactive `.obs` variables.
- Use `Obx(() => ...)` for reactive UI updates.
- **No BLoC, no flutter_bloc, no bloc_test, no Equatable.**
- Split large controllers by sub-feature.

## DI (GetX)

- Use `Get.lazyPut<T>(() => ..., fenix: true)` in `Bindings` classes.
- Use `Get.find<T>()` to resolve dependencies.
- **No GetIt, no `sl` instance.**
- Core services are registered in `InitialBinding` (runs at app start).
- Feature-specific deps are registered in each `GetPage`'s `binding`.

## Routing (GetX)

- Define route name constants in `AppRoutes`.
- Register `GetPage` entries in `AppPages.routes`.
- Navigate with `Get.toNamed`, `Get.offNamed`, `Get.offAllNamed`.
- Auth middleware: `GetMiddleware.redirect()` checks `SessionService.isAuthenticated`.
- **No go_router.**

## Networking

- Keep **Dio** (not GetConnect) — better for offline sync interceptors.
- Retrofit `@RestApi` for type-safe endpoints.
- `RequestInterceptor` injects Bearer token from `SecureStorageService`.
- Wrap all API calls with `safeApiCall` from `lib/core/network/safe_api_call.dart`.
- Nest API response: `{ data: T }` — deserialize through `BaseResponse<T>`.

## Auth

- JWT tokens in `flutter_secure_storage`.
- `SessionService` (GetxController) exposes `isAuthenticated.obs`.
- After logout: `Get.offAllNamed(AppRoutes.login)`.

## Design tokens & fidelity

- Colors: `AppColors`, spacing: `AppSpacing`, radius: `AppRadius`, text: `AppTextStyles`, shadows: `AppShadows`.
- **Never use inline hex, rem, or raw px values.**
- Reusable widgets go in `lib/core/widgets/` with `app_` prefix.
- **Never duplicate UI chrome in feature code.** Import from the kit:
  ```dart
  import 'package:owezy_mobile/core/widgets/widgets.dart';
  // AppButton, AppTextField, AppCard, AppAmount, AppAvatar, AppBadge, AppAlert,
  // AppChip, AppSwitch, AppIconButton, AppHeroCard, AppGroupCard, AppListRow,
  // AppSegmentedControl, AppUnderlineTabs, AppProgressBar, AppAmountInput, AppBottomTabBar
  ```
- **Theme-aware colours:** Use `context.app*` from `AppBuildContextX` (in `app_colors_ext.dart`), not `AppColorsLight.*` / `AppColorsDark.*` directly.
  ```dart
  import 'package:owezy_mobile/core/theme/app_colors_ext.dart';
  Container(color: context.appSurface)
  Text('', style: TextStyle(color: context.appTextMuted))
  ```
- **Dark mode:** `ThemeController` in `InitialBinding` drives `themeMode`. Features set it via `Get.find<ThemeController>().setMode(...)`.
- **Design source of truth:** Figma [Owezy Mobile](https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile) (`fileKey` `aPUmKuvCpwnIAD5m53Rh7c`). Load `/figma-design-to-code`, then `get_screenshot` + `get_design_context` for the target `node-id` before writing or changing UI. Do not use local `resources/owezy-mobile/` HTML/PNG for new UI.
- Port Figma structure (layout regions, field/button chrome, icons from the file mirrored into app assets). Do not ship raw Material defaults (`TextField` / `CheckboxListTile` / generic `DropdownButton` chrome) when the design specifies Owezy patterns.
- If no exact frame exists, adapt the closest screen in the same Figma file and record the borrowed `node-id`; still use tokens + shared widgets — never invent a one-off look.

## Localization (required)

- **All user-facing copy must come from Flutter gen-l10n.** No hardcoded UI strings in pages, widgets, dialogs, snackbars, or validation messages.
- Source catalogs: `lib/l10n/app_<locale>.arb` (template locale: `en` → `app_en.arb`).
- Config: `l10n.yaml` at `apps/mobile/` (`arb-dir: lib/l10n`, `template-arb-file: app_en.arb`, `output-localization-file: app_localizations.dart`).
- Wire `flutter_localizations` + `AppLocalizations.delegate` / `supportedLocales` on `GetMaterialApp`.
- In UI: `AppLocalizations.of(context)!` (or a thin context extension). Prefer placeholders (`{name}`) over string concatenation.
- Map API / `FailureCode` values to localized strings in presentation — never show raw API `message` text to users.
- **Do not use GetX `.tr` / `Translations`.** One system only: Flutter gen-l10n (`flutter_localizations` + `intl` already in `pubspec.yaml`).
- New features must add ARB keys in the same change as the UI that uses them.
- Tests that assert visible copy should use the localization key / `AppLocalizations` lookup, not a brittle hardcoded English sentence unless the test loads `en` delegates explicitly.

## File naming

`snake_case` for all Dart files and folders; `PascalCase` for classes.

## Testing

- Mirror tree: `test/features/<name>/{data,domain,presentation}/`.
- Use `flutter_test`; mock with `mockito` or manual fakes.
- **No financial data in test fixtures.**
- GetxController tests: call `onInit()` directly, then assert `.value` changes.
