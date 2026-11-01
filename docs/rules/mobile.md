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

## Design tokens

- Colors: `AppColors`, spacing: `AppSpacing`, radius: `AppRadius`, text: `AppTextStyles`.
- **Never use inline hex, rem, or raw px values.**
- Reusable widgets go in `lib/core/widgets/` with `app_` prefix.

## File naming

`snake_case` for all Dart files and folders; `PascalCase` for classes.

## Testing

- Mirror tree: `test/features/<name>/{data,domain,presentation}/`.
- Use `flutter_test`; mock with `mockito` or manual fakes.
- **No financial data in test fixtures.**
- GetxController tests: call `onInit()` directly, then assert `.value` changes.
