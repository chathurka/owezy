# ADR-0004: Mobile State Management

**Status:** accepted  
**Date:** 2026-11-01

## Context

The Owezy mobile app needs state management, dependency injection, and routing. The memosys reference implementation uses BLoC + GetIt + go_router. Owezy needs to choose its own approach.

## Decision

**GetX** (`get: ^4.6.6`) replaces all three:

| Concern | memosys | Owezy |
|---------|---------|-------|
| State management | BLoC + Equatable | GetxController + `.obs` |
| Dependency injection | GetIt | GetX bindings (`Get.lazyPut`, `Get.find`) |
| Routing | go_router | GetX (`GetMaterialApp`, `GetPage`, `Get.toNamed`) |

Networking uses **Dio** (not GetConnect) because Dio's interceptor stack is better suited to the offline sync queue pattern planned for Phase 4.

## Rationale

GetX reduces boilerplate significantly for the MVP delivery timeline. A single package handles state, DI, and routing with no additional setup. The Clean Architecture layering (data/domain/presentation) is preserved — only the presentation-layer mechanism changes.

## Consequences

- No BLoC, flutter_bloc, bloc_test, Equatable, GetIt, or go_router in `apps/mobile/`.
- Controllers use reactive `.obs` variables and `Obx(() => ...)` for UI binding.
- Feature bindings register dependencies; `InitialBinding` registers core singletons.
- Auth middleware uses `GetMiddleware.redirect()` reading `SessionService.isAuthenticated`.
- Test controllers directly (call `onInit()`, assert `.value`) — no `bloc_test` needed.
