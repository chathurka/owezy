/// Owezy shared design-system widgets.
///
/// All widgets in this library:
/// - Use only tokens from `lib/core/theme/` (never inline hex/px values).
/// - Resolve colours via [AppBuildContextX] for light/dark support.
/// - Respect the DESIGN_SPEC elevation policy (borders in light, steps in dark).
/// - Enforce the money colour rule (AppAmount requires sign or label).
///
/// Import this barrel in feature code:
/// ```dart
/// import 'package:owezy_mobile/core/widgets/widgets.dart';
/// ```
library;

// ── Primitives ────────────────────────────────────────────────────────────────
export 'app_alert.dart';
export 'app_amount.dart';
export 'app_avatar.dart';
export 'app_badge.dart';
export 'app_button.dart';
export 'app_card.dart';
export 'app_chip.dart';
export 'app_icon_button.dart';
export 'app_switch.dart';
export 'app_text_field.dart';

// ── Composite components (DESIGN_SPEC §2 full set) ───────────────────────────
export 'app_amount_input.dart';
export 'app_bottom_tab_bar.dart';
export 'app_group_card.dart';
export 'app_hero_card.dart';
export 'app_list_row.dart';
export 'app_progress_bar.dart';
export 'app_segmented_control.dart';
export 'app_underline_tabs.dart';
