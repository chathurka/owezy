import 'package:get/get.dart';

import '../../features/auth/presentation/bindings/forgot_password_binding.dart';
import '../../features/auth/presentation/bindings/login_binding.dart';
import '../../features/auth/presentation/bindings/register_binding.dart';
import '../../features/auth/presentation/bindings/reset_password_binding.dart';
import '../../features/auth/presentation/bindings/verify_email_binding.dart';
import '../../features/auth/presentation/pages/forgot_password_page.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/register_page.dart';
import '../../features/auth/presentation/pages/reset_password_page.dart';
import '../../features/auth/presentation/pages/verify_email_page.dart';
import '../../features/auth/presentation/pages/welcome_page.dart';
import '../../features/home/presentation/bindings/home_binding.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/groups/presentation/bindings/accept_invitation_binding.dart';
import '../../features/groups/presentation/bindings/create_group_binding.dart';
import '../../features/groups/presentation/bindings/group_onboarding_binding.dart';
import '../../features/groups/presentation/bindings/group_overview_binding.dart';
import '../../features/groups/presentation/bindings/groups_list_binding.dart';
import '../../features/groups/presentation/pages/accept_invitation_page.dart';
import '../../features/groups/presentation/pages/create_group_page.dart';
import '../../features/groups/presentation/pages/group_onboarding_page.dart';
import '../../features/groups/presentation/pages/group_overview_page.dart';
import '../../features/groups/presentation/pages/groups_list_page.dart';
import '../../features/profile/presentation/bindings/profile_binding.dart';
import '../../features/profile/presentation/bindings/profile_setup_binding.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/profile/presentation/pages/profile_setup_page.dart';
import '../middleware/auth_middleware.dart';
import 'app_routes.dart';

abstract final class AppPages {
  static final routes = <GetPage>[
    GetPage(
      name: AppRoutes.initial,
      page: () => const WelcomePage(),
    ),
    GetPage(
      name: AppRoutes.welcome,
      page: () => const WelcomePage(),
    ),
    GetPage(
      name: AppRoutes.login,
      page: () => const LoginPage(),
      binding: LoginBinding(),
    ),
    GetPage(
      name: AppRoutes.register,
      page: () => const RegisterPage(),
      binding: RegisterBinding(),
    ),
    GetPage(
      name: AppRoutes.verifyEmail,
      page: () => const VerifyEmailPage(),
      binding: VerifyEmailBinding(),
    ),
    GetPage(
      name: AppRoutes.forgotPassword,
      page: () => const ForgotPasswordPage(),
      binding: ForgotPasswordBinding(),
    ),
    GetPage(
      name: AppRoutes.resetPassword,
      page: () => const ResetPasswordPage(),
      binding: ResetPasswordBinding(),
    ),
    GetPage(
      name: AppRoutes.profileSetup,
      page: () => const ProfileSetupPage(),
      binding: ProfileSetupBinding(),
      middlewares: [AuthMiddleware()],
    ),
    GetPage(
      name: AppRoutes.groupOnboarding,
      page: () => const GroupOnboardingPage(),
      binding: GroupOnboardingBinding(),
      middlewares: [AuthMiddleware()],
    ),
    GetPage(
      name: AppRoutes.groups,
      page: () => const GroupsListPage(),
      binding: GroupsListBinding(),
      middlewares: [AuthMiddleware()],
    ),
    GetPage(
      name: AppRoutes.createGroup,
      page: () => const CreateGroupPage(),
      binding: CreateGroupBinding(),
      middlewares: [AuthMiddleware()],
    ),
    GetPage(
      name: AppRoutes.acceptInvitation,
      page: () => const AcceptInvitationPage(),
      binding: AcceptInvitationBinding(),
      middlewares: [AuthMiddleware()],
    ),
    GetPage(
      name: AppRoutes.groupOverview,
      page: () => const GroupOverviewPage(),
      binding: GroupOverviewBinding(),
      middlewares: [AuthMiddleware()],
    ),
    GetPage(
      name: AppRoutes.profile,
      page: () => const ProfilePage(),
      binding: ProfileBinding(),
      middlewares: [AuthMiddleware()],
    ),
    GetPage(
      name: AppRoutes.home,
      page: () => const HomePage(),
      binding: HomeBinding(),
      middlewares: [AuthMiddleware()],
    ),
  ];
}
