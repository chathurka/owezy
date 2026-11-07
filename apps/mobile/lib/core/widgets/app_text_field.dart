import 'package:flutter/material.dart';

import '../theme/app_colors_ext.dart';
import '../theme/app_radius.dart';
import '../theme/app_shadows.dart';
import '../theme/app_text_styles.dart';

/// Owezy text input — 52h, radius 16, 1.5px border.
///
/// Design source: DESIGN_SPEC §2 — Text input.
/// - Height 52, radius 16
/// - 1.5px border in `borderStrong`; focused → `primary` border + 4px primarySoft ring
/// - Error → `danger` border + `oweSoft` ring
/// - Optional leading icon (SVG or any widget, positioned at left:14)
/// - Optional trailing suffix widget
///
/// ```dart
/// AppTextField(
///   label: 'Email',
///   placeholder: 'you@example.com',
///   keyboardType: TextInputType.emailAddress,
///   leading: SvgPicture.asset(AppAssets.iconMail, width: 18),
///   onChanged: (v) => controller.email.value = v,
/// )
/// ```
class AppTextField extends StatefulWidget {
  const AppTextField({
    super.key,
    this.label,
    this.placeholder,
    this.errorText,
    this.initialValue,
    this.controller,
    this.focusNode,
    this.onChanged,
    this.onSubmitted,
    this.keyboardType,
    this.obscureText = false,
    this.leading,
    this.trailing,
    this.textInputAction,
    this.autofillHints,
    this.readOnly = false,
    this.maxLines = 1,
  });

  final String? label;
  final String? placeholder;
  final String? errorText;
  final String? initialValue;
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final TextInputType? keyboardType;
  final bool obscureText;
  final Widget? leading;
  final Widget? trailing;
  final TextInputAction? textInputAction;
  final Iterable<String>? autofillHints;
  final bool readOnly;
  final int maxLines;

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  late FocusNode _focus;
  TextEditingController? _ownedController;
  bool _hasFocus = false;

  TextEditingController? get _effectiveController =>
      widget.controller ?? _ownedController;

  @override
  void initState() {
    super.initState();
    _focus = widget.focusNode ?? FocusNode();
    _focus.addListener(_onFocusChange);
    if (widget.controller == null && widget.initialValue != null) {
      _ownedController = TextEditingController(text: widget.initialValue);
    }
  }

  void _onFocusChange() {
    setState(() => _hasFocus = _focus.hasFocus);
  }

  @override
  void dispose() {
    if (widget.focusNode == null) _focus.dispose();
    _ownedController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hasError = widget.errorText != null && widget.errorText!.isNotEmpty;

    final Color borderColor;
    final List<BoxShadow>? shadow;
    if (hasError) {
      borderColor = context.appDanger;
      shadow = [AppShadows.focusRing(context.appOweSoft)];
    } else if (_hasFocus) {
      borderColor = context.appPrimary;
      shadow = [AppShadows.focusRing(context.appPrimarySoft)];
    } else {
      borderColor = context.appBorderStrong;
      shadow = null;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: AppTextStyles.caption.copyWith(
              fontWeight: FontWeight.w600,
              color: context.appTextMuted,
            ),
          ),
          const SizedBox(height: 6),
        ],
        Container(
          height: widget.maxLines == 1 ? 52.0 : null,
          decoration: BoxDecoration(
            color: context.appSurface,
            borderRadius: AppRadius.input,
            border: Border.all(color: borderColor, width: 1.5),
            boxShadow: shadow,
          ),
          padding: widget.leading != null
              ? EdgeInsets.zero
              : const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              if (widget.leading != null)
                Padding(
                  padding: const EdgeInsets.only(left: 14),
                  child: widget.leading,
                ),
              Expanded(
                child: TextField(
                  controller: _effectiveController,
                  focusNode: _focus,
                  onChanged: widget.onChanged,
                  onSubmitted: widget.onSubmitted,
                  keyboardType: widget.keyboardType,
                  obscureText: widget.obscureText,
                  textInputAction: widget.textInputAction,
                  autofillHints: widget.autofillHints,
                  readOnly: widget.readOnly,
                  maxLines: widget.obscureText ? 1 : widget.maxLines,
                  style: AppTextStyles.body.copyWith(color: context.appText),
                  cursorColor: context.appPrimary,
                  decoration: InputDecoration(
                    hintText: widget.placeholder,
                    hintStyle: AppTextStyles.body.copyWith(
                      color: context.appTextMuted,
                      fontWeight: FontWeight.w500,
                    ),
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    errorBorder: InputBorder.none,
                    focusedErrorBorder: InputBorder.none,
                    filled: false,
                    contentPadding: EdgeInsets.only(
                      left: widget.leading != null ? 10 : 0,
                      right: 4,
                      top: widget.maxLines > 1 ? 14 : 0,
                      bottom: widget.maxLines > 1 ? 14 : 0,
                    ),
                    suffixIcon: widget.trailing,
                    suffixIconConstraints:
                        const BoxConstraints(minWidth: 42, minHeight: 34),
                    isDense: true,
                  ),
                ),
              ),
            ],
          ),
        ),
        if (hasError) ...[
          const SizedBox(height: 6),
          Text(
            widget.errorText!,
            style: AppTextStyles.caption.copyWith(
              color: context.appDanger,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ],
    );
  }
}
