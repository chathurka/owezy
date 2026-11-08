import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../../core/theme/app_colors_ext.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/widgets/app_text_field.dart';

// Design: CreateAccount.dc.html / CreateAccountDark.dc.html
// Delegates to AppTextField from lib/core/widgets — theme-aware light + dark.

/// Thin wrapper around [AppTextField] scoped to the register form.
///
/// Provides the SVG leading icon wired to the current theme's muted colour
/// and surfaces error state from the controller.
class RegisterFormField extends StatelessWidget {
  const RegisterFormField({
    super.key,
    required this.label,
    required this.iconAsset,
    required this.onChanged,
    this.placeholder,
    this.errorText,
    this.keyboardType,
    this.obscureText = false,
    this.focused = false,
    this.suffix,
  });

  final String label;
  final String iconAsset;
  final ValueChanged<String> onChanged;
  final String? placeholder;
  final String? errorText;
  final TextInputType? keyboardType;
  final bool obscureText;

  /// Pass true while the field has valid content to show the focus ring.
  final bool focused;
  final Widget? suffix;

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      label: label,
      placeholder: placeholder,
      errorText: errorText,
      onChanged: onChanged,
      keyboardType: keyboardType,
      obscureText: obscureText,
      trailing: suffix,
      leading: Padding(
        padding: const EdgeInsets.only(right: 10),
        child: SvgPicture.asset(
          iconAsset,
          width: AppDimensions.size18,
          height: AppDimensions.size18,
          colorFilter: ColorFilter.mode(
            context.appTextMuted,
            BlendMode.srcIn,
          ),
        ),
      ),
    );
  }
}
