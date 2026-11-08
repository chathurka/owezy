import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../../app/routes/app_routes.dart';
import '../../../../core/l10n/l10n_extension.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/app_button.dart';
import '../controllers/home_controller.dart';

class HomePage extends GetView<HomeController> {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(l10n.appName),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.page),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                l10n.homeWelcomeTitle,
                style: AppTextStyles.title,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.s3),
              Text(
                l10n.homeWelcomeSubtitle,
                style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.s6),
              AppButton(
                label: l10n.profileTitle,
                variant: AppButtonVariant.secondary,
                onPressed: () => Get.toNamed(AppRoutes.profile),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
