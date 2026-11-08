import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { AuthService } from '../application/auth.service';
import { AppleSignInDto } from './dto/apple-sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
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
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sign out current session' })
  @ApiNoContentResponse({ description: 'Signed out' })
  async logout(): Promise<void> {
    await this.authService.logout();
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
}
