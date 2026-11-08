import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RefreshResponse } from './responses/refresh.response';
import {
  AuthUser,
  CurrentUser,
} from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { Role } from '../../../core/auth/role.enum';
import { AuthService } from '../application/auth.service';
import { AppleSignInDto } from './dto/apple-sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginResponse } from './responses/login.response';
import { RegisterResponse } from './responses/register.response';
import { ResetPasswordResponse } from './responses/reset-password.response';
import { VerifyEmailResponse } from './responses/verify-email.response';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register with email and password' })
  @ApiCreatedResponse({ type: RegisterResponse })
  @ApiConflictResponse({ description: 'Email already registered' })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Public()
  @Post('apple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in or register with Apple' })
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid Apple identity token' })
  @ApiConflictResponse({ description: 'Account link conflict' })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  signInWithApple(@Body() dto: AppleSignInDto): Promise<LoginResponse> {
    return this.authService.signInWithApple(dto);
  }

  @Public()
  @Post('email/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address with 6-digit code or token' })
  @ApiOkResponse({ type: VerifyEmailResponse })
  @ApiBadRequestResponse({ description: 'Token invalid, expired, or already consumed (VERIFICATION_TOKEN_INVALID)' })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<{ email: string; emailVerified: true }> {
    return this.authService.verifyEmail(dto.token);
  }

  @Public()
  @Post('email/resend')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Resend verification email (non-enumerating)' })
  @ApiNoContentResponse({ description: 'Accepted (always; no account enumeration)' })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  async resendVerification(@Body() dto: ResendVerificationDto): Promise<void> {
    await this.authService.resendVerification(dto.email);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange refresh token for new session tokens' })
  @ApiOkResponse({ type: RefreshResponse })
  @ApiUnauthorizedResponse({ description: 'Session expired or token invalid (SESSION_EXPIRED)' })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  async refresh(
    @Body() dto: RefreshDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sign out and revoke refresh token when provided' })
  @ApiNoContentResponse({ description: 'Signed out' })
  async logout(@Body() dto?: LogoutDto): Promise<void> {
    await this.authService.logout(dto?.refreshToken);
  }

  @Public()
  @Post('password/forgot')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Request password reset email (non-enumerating)' })
  @ApiNoContentResponse({
    description: 'Always accepted; email sent only when active user exists',
  })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with single-use token' })
  @ApiOkResponse({ type: ResetPasswordResponse })
  @ApiBadRequestResponse({
    description: 'Token invalid, expired, or already used (RESET_TOKEN_INVALID)',
  })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ ok: true }> {
    await this.authService.resetPassword(dto.token, dto.password);
    return { ok: true };
  }

  @Post('mfa/setup')
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Begin TOTP MFA setup for the authenticated admin' })
  @ApiOkResponse({ description: 'otpauth URL and secret' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  setupMfa(@CurrentUser() user: AuthUser) {
    return this.authService.setupMfa(user.userId);
  }

  @Public()
  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify MFA code for login challenge' })
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse()
  @ApiUnprocessableEntityResponse()
  verifyMfaLogin(@Body() dto: MfaVerifyDto) {
    return this.authService.verifyMfa({
      code: dto.code,
      mfaToken: dto.mfaToken,
    });
  }

  @Post('mfa/confirm')
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm MFA setup with a TOTP code' })
  @ApiOkResponse({ description: 'MFA enabled' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  confirmMfaSetup(@Body() dto: MfaVerifyDto, @CurrentUser() user: AuthUser) {
    return this.authService.verifyMfa({
      code: dto.code,
      setup: true,
      userId: user.userId,
    });
  }
}
