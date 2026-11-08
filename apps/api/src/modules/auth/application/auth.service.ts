import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, randomInt } from 'crypto';
import { authenticator } from 'otplib';
import { User } from '../domain/user.entity';
import { RefreshTokenRepository } from '../domain/refresh-token.repository';
import { UserRepository } from '../domain/user.repository';
import { AppleSignInDto } from '../presentation/dto/apple-sign-in.dto';
import { GoogleSignInDto } from '../presentation/dto/google-sign-in.dto';
import { LoginDto } from '../presentation/dto/login.dto';
import { RegisterDto } from '../presentation/dto/register.dto';
import { LoginResponse } from '../presentation/responses/login.response';
import { RegisterResponse } from '../presentation/responses/register.response';
import { AppleTokenVerifier } from './apple-token.verifier';
import { EmailPort } from './email.port';
import { GoogleTokenVerifier } from './google-token.verifier';

const BCRYPT_ROUNDS = 12;
const DEFAULT_APPLE_CURRENCY = 'USD';
const DEFAULT_GOOGLE_CURRENCY = 'USD';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly users: UserRepository,
    private readonly email: EmailPort,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly appleTokens: AppleTokenVerifier,
    private readonly googleTokens: GoogleTokenVerifier,
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.bootstrapAdminIfNeeded();
  }

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const existing = await this.users.findActiveByEmail(dto.email);
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'An account with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const verificationToken = this.generate6DigitCode();
    const tokenHash = createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    const ttlSecs = this.config.get<number>('email.verificationCodeTtl') ?? 900;
    const expiresAt = new Date(Date.now() + ttlSecs * 1000);

    const user = await this.users.createUserWithVerificationToken(
      {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        role: 'user',
        emailVerified: false,
        defaultCurrency: dto.defaultCurrency,
      },
      {
        tokenHash,
        expiresAt,
      },
    );

    try {
      await this.email.sendVerificationEmail({
        to: user.email,
        fullName: user.fullName,
        verificationToken,
      });
    } catch {
      this.logger.error('Verification email send threw after user create');
    }

    const tokens = await this.issueTokens(user);

    return {
      ...tokens,
      user: {
        ...this.toAuthUserPayload(user),
        role: 'user',
      },
      emailVerificationRequired: true,
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.users.findActiveByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw this.invalidCredentials();
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw this.invalidCredentials();
    }

    if (user.mfaEnabled && user.mfaSecret) {
      const mfaToken = await this.jwt.signAsync(
        { sub: user.id, type: 'mfa', email: user.email, role: user.role },
        {
          secret: this.config.get<string>('jwt.accessSecret'),
          expiresIn: '5m',
        },
      );
      return { mfaRequired: true, mfaToken };
    }

    return this.toLoginResponse(user);
  }

  async provisionAdmin(input: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<{
    id: string;
    email: string;
    fullName: string;
    role: 'admin';
  }> {
    this.validatePasswordStrength(input.password);
    const existing = await this.users.findActiveByEmail(input.email);
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'An account with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await this.users.createAdminUser({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: 'admin',
    };
  }

  async setupMfa(userId: string): Promise<{ otpauthUrl: string; secret: string }> {
    const user = await this.users.findActiveById(userId);
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Admin authentication required',
      });
    }

    const secret = authenticator.generateSecret();
    await this.users.updateMfaSecret(userId, secret, false);
    const otpauthUrl = authenticator.keyuri(user.email, 'Owezy Admin', secret);
    return { otpauthUrl, secret };
  }

  async verifyMfa(input: {
    code: string;
    mfaToken?: string;
    setup?: boolean;
    userId?: string;
  }): Promise<LoginResponse | { mfaEnabled: true }> {
    if (input.setup && input.userId) {
      const user = await this.users.findActiveById(input.userId);
      if (!user?.mfaSecret) {
        throw new BadRequestException({
          code: 'MFA_NOT_STARTED',
          message: 'MFA setup has not been started',
        });
      }
      const valid = authenticator.check(input.code, user.mfaSecret);
      if (!valid) {
        throw new UnauthorizedException({
          code: 'INVALID_MFA_CODE',
          message: 'Invalid authentication code',
        });
      }
      await this.users.updateMfaSecret(user.id, user.mfaSecret, true);
      return { mfaEnabled: true };
    }

    if (!input.mfaToken) {
      throw new UnprocessableEntityException({
        code: 'VALIDATION_FAILED',
        message: 'mfaToken is required for login MFA',
      });
    }

    let payload: { sub: string; type?: string };
    try {
      payload = await this.jwt.verifyAsync(input.mfaToken, {
        secret: this.config.get<string>('jwt.accessSecret'),
      });
    } catch {
      throw new UnauthorizedException({
        code: 'INVALID_MFA_TOKEN',
        message: 'MFA challenge expired or invalid',
      });
    }
    if (payload.type !== 'mfa') {
      throw new UnauthorizedException({
        code: 'INVALID_MFA_TOKEN',
        message: 'MFA challenge expired or invalid',
      });
    }

    const user = await this.users.findActiveById(payload.sub);
    if (!user?.mfaSecret || !user.mfaEnabled) {
      throw new UnauthorizedException({
        code: 'INVALID_MFA_CODE',
        message: 'Invalid authentication code',
      });
    }
    const valid = authenticator.check(input.code, user.mfaSecret);
    if (!valid) {
      throw new UnauthorizedException({
        code: 'INVALID_MFA_CODE',
        message: 'Invalid authentication code',
      });
    }

    return this.toLoginResponse(user);
  }

  private async bootstrapAdminIfNeeded(): Promise<void> {
    const email = this.config.get<string>('admin.bootstrapEmail');
    const password = this.config.get<string>('admin.bootstrapPassword');
    if (!email || !password) return;

    const count = await this.users.countActiveAdmins();
    if (count > 0) return;

    try {
      await this.provisionAdmin({
        email,
        password,
        fullName: 'Owezy Admin',
      });
      this.logger.log('Bootstrapped initial admin account');
    } catch (error) {
      this.logger.error('Admin bootstrap failed');
    }
  }

  async signInWithApple(dto: AppleSignInDto): Promise<LoginResponse> {
    const claims = await this.appleTokens.verify(dto.identityToken);

    const linked = await this.users.findActiveByAppleSubject(claims.sub);
    if (linked) {
      return this.toLoginResponse(linked);
    }

    const emailFromToken = claims.email?.trim().toLowerCase();
    const emailFromClient = dto.email?.trim().toLowerCase();
    const email = emailFromToken || emailFromClient || undefined;

    if (!email) {
      throw new UnprocessableEntityException({
        code: 'APPLE_EMAIL_REQUIRED',
        message: 'Apple did not provide an email for this new account',
      });
    }

    const existingByEmail = await this.users.findActiveByEmail(email);
    if (existingByEmail) {
      const existingAppleSub = await this.users.findAppleSubjectByUserId(
        existingByEmail.id,
      );
      if (existingAppleSub && existingAppleSub !== claims.sub) {
        throw new ConflictException({
          code: 'ACCOUNT_LINK_CONFLICT',
          message: 'This email is already linked to a different Apple account',
        });
      }

      if (!existingAppleSub) {
        await this.users.linkAppleIdentity(
          existingByEmail.id,
          claims.sub,
          email,
        );
      }

      return this.toLoginResponse(existingByEmail);
    }

    const fullName =
      dto.fullName?.trim() ||
      (email.includes('@') ? email.split('@')[0] : 'Owezy User');

    // Apple-asserted emails (including private relay) are treated as verified.
    const created = await this.users.createAppleUser({
      email,
      fullName,
      emailVerified: Boolean(emailFromToken) || claims.emailVerified,
      defaultCurrency: DEFAULT_APPLE_CURRENCY,
      appleSubject: claims.sub,
    });

    return this.toLoginResponse(created);
  }

  async signInWithGoogle(dto: GoogleSignInDto): Promise<LoginResponse> {
    const claims = await this.googleTokens.verify(dto.idToken);

    const linked = await this.users.findActiveByGoogleSubject(claims.sub);
    if (linked) {
      return this.toLoginResponse(linked);
    }

    const emailFromToken =
      claims.emailVerified && claims.email
        ? claims.email.trim().toLowerCase()
        : undefined;
    const emailFromClient = dto.email?.trim().toLowerCase();
    // Only trust client email when Google already asserted a verified email.
    const email = emailFromToken || (claims.emailVerified ? emailFromClient : undefined);

    if (!email || !claims.emailVerified) {
      throw new UnprocessableEntityException({
        code: 'GOOGLE_EMAIL_REQUIRED',
        message: 'Google did not provide a verified email for this new account',
      });
    }

    const existingByEmail = await this.users.findActiveByEmail(email);
    if (existingByEmail) {
      const existingGoogleSub = await this.users.findGoogleSubjectByUserId(
        existingByEmail.id,
      );
      if (existingGoogleSub && existingGoogleSub !== claims.sub) {
        throw new ConflictException({
          code: 'ACCOUNT_LINK_CONFLICT',
          message: 'This email is already linked to a different Google account',
        });
      }

      if (!existingGoogleSub) {
        await this.users.linkGoogleIdentity(
          existingByEmail.id,
          claims.sub,
          email,
        );
      }

      return this.toLoginResponse(existingByEmail);
    }

    const fullName =
      dto.fullName?.trim() ||
      (email.includes('@') ? email.split('@')[0] : 'Owezy User');

    const created = await this.users.createGoogleUser({
      email,
      fullName,
      emailVerified: true,
      defaultCurrency: DEFAULT_GOOGLE_CURRENCY,
      googleSubject: claims.sub,
    });

    return this.toLoginResponse(created);
  }

  async verifyEmail(token: string): Promise<{ email: string; emailVerified: true }> {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const result = await this.users.consumeVerificationToken(tokenHash);

    if (!result) {
      throw new BadRequestException({
        code: 'VERIFICATION_TOKEN_INVALID',
        message: 'The verification code is invalid, expired, or already used',
      });
    }

    const { email } = await this.users.markEmailVerified(result.userId);
    return { email, emailVerified: true };
  }

  async resendVerification(email: string): Promise<void> {
    // Always return without revealing account existence.
    const cooldownSecs =
      this.config.get<number>('email.resendCooldownSecs') ?? 60;

    const latest = await this.users.findLatestVerificationTokenCreatedAt(email);
    if (!latest) return;

    const secondsSinceLast =
      (Date.now() - latest.createdAt.getTime()) / 1000;
    if (secondsSinceLast < cooldownSecs) return;

    const verificationToken = this.generate6DigitCode();
    const tokenHash = createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    const ttlSecs =
      this.config.get<number>('email.verificationCodeTtl') ?? 900;
    const expiresAt = new Date(Date.now() + ttlSecs * 1000);

    await this.users.rotateVerificationToken(
      latest.userId,
      tokenHash,
      expiresAt,
    );

    // Find user to get fullName for email (use email as fallback for the name)
    const user = await this.users.findActiveByEmail(email);
    if (!user) return;

    try {
      await this.email.sendVerificationEmail({
        to: user.email,
        fullName: user.fullName,
        verificationToken,
      });
    } catch {
      this.logger.error('Resend verification email threw');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    // Always return void — no account enumeration.
    const cooldownSecs =
      this.config.get<number>('passwordReset.cooldownSecs') ?? 60;

    const latest =
      await this.users.findLatestPasswordResetTokenCreatedAt(email);
    if (!latest) return;

    // Cooldown: skip if a token was created within the cooldown window.
    const secondsSinceLast =
      (Date.now() - latest.createdAt.getTime()) / 1000;
    if (secondsSinceLast < cooldownSecs) return;

    const plainToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(plainToken).digest('hex');
    const ttlSecs =
      this.config.get<number>('passwordReset.ttlSecs') ?? 1800;
    const expiresAt = new Date(Date.now() + ttlSecs * 1000);

    await this.users.createPasswordResetToken(
      latest.userId,
      tokenHash,
      expiresAt,
    );

    // Find user for fullName
    const user = await this.users.findActiveByEmail(email);
    if (!user) return;

    try {
      await this.email.sendPasswordResetEmail({
        to: user.email,
        fullName: user.fullName,
        resetToken: plainToken,
      });
    } catch {
      this.logger.error('Password reset email send threw after token create');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    this.validatePasswordStrength(password);

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const result = await this.users.consumePasswordResetToken(tokenHash);

    if (!result) {
      throw new BadRequestException({
        code: 'RESET_TOKEN_INVALID',
        message: 'The password reset link is invalid, expired, or already used',
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await this.users.updatePasswordHash(result.userId, passwordHash);
  }

  async refresh(
    rawRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Verify JWT signature and type claim
    let payload: { sub: string; type?: string };
    try {
      payload = await this.jwt.verifyAsync<{ sub: string; type?: string }>(
        rawRefreshToken,
        { secret: this.config.get<string>('jwt.refreshSecret') },
      );
    } catch {
      throw this.sessionExpired();
    }

    if (payload.type !== 'refresh') {
      throw this.sessionExpired();
    }

    // 2. Look up unrevoked hash in DB
    const tokenHash = createHash('sha256').update(rawRefreshToken).digest('hex');
    const stored = await this.refreshTokens.findValid(tokenHash);
    if (!stored) {
      throw this.sessionExpired();
    }

    // 3. Find the user
    const user = await this.users.findActiveById(stored.userId);
    if (!user) {
      throw this.sessionExpired();
    }

    // 4. Rotate: revoke old, issue new pair
    await this.refreshTokens.revoke(stored.id);
    return this.issueTokens(user);
  }

  async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) return;
    const tokenHash = createHash('sha256').update(rawRefreshToken).digest('hex');
    await this.refreshTokens.revokeByHash(tokenHash);
  }

  private sessionExpired(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'SESSION_EXPIRED',
      message: 'Your session has expired. Please sign in again.',
    });
  }

  private validatePasswordStrength(password: string): void {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('password too short');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('password must contain at least one digit');
    }
    if (errors.length > 0) {
      throw new UnprocessableEntityException({
        code: 'VALIDATION_FAILED',
        message: 'Password does not meet strength requirements',
        details: [{ field: 'password', messages: errors }],
      });
    }
  }

  private generate6DigitCode(): string {
    return String(randomInt(0, 1_000_000)).padStart(6, '0');
  }

  private toAuthUserPayload(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      emailVerified: user.emailVerified,
      defaultCurrency: user.defaultCurrency,
      phone: user.phone,
      paymentHandle: user.paymentHandle,
      avatarUrl: user.avatarUrl,
      profileSetupCompletedAt: user.profileSetupCompletedAt
        ? user.profileSetupCompletedAt.toISOString()
        : null,
    };
  }

  private async toLoginResponse(user: User): Promise<LoginResponse> {
    const tokens = await this.issueTokens(user);
    return {
      ...tokens,
      user: this.toAuthUserPayload(user),
    };
  }

  private invalidCredentials(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    });
  }

  private async issueTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshExpiresIn =
      this.config.get<string>('jwt.refreshExpiresIn') ?? '7d';

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessExpiresIn') ?? '15m',
      },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, type: 'refresh' },
      {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: refreshExpiresIn,
      },
    );

    // Store SHA-256 hash of refresh token for revocation
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = this.refreshExpiryDate(refreshExpiresIn);
    await this.refreshTokens.store(user.id, tokenHash, expiresAt);

    return { accessToken, refreshToken };
  }

  private refreshExpiryDate(expiresIn: string): Date {
    const match = /^(\d+)([smhd])$/.exec(expiresIn);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return new Date(Date.now() + value * multipliers[unit]);
  }
}
