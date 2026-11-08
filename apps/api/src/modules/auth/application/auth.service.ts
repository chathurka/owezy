import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomInt } from 'crypto';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { AppleSignInDto } from '../presentation/dto/apple-sign-in.dto';
import { LoginDto } from '../presentation/dto/login.dto';
import { RegisterDto } from '../presentation/dto/register.dto';
import { LoginResponse } from '../presentation/responses/login.response';
import { RegisterResponse } from '../presentation/responses/register.response';
import { AppleTokenVerifier } from './apple-token.verifier';
import { EmailPort } from './email.port';

const BCRYPT_ROUNDS = 12;
const DEFAULT_APPLE_CURRENCY = 'USD';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly users: UserRepository,
    private readonly email: EmailPort,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly appleTokens: AppleTokenVerifier,
  ) {}

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
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: 'user',
        emailVerified: user.emailVerified,
        defaultCurrency: user.defaultCurrency,
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

    return this.toLoginResponse(user);
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

  async logout(): Promise<void> {
    // Refresh-token revocation is Phase 2 (ADR-0001). Clients clear local session.
  }

  private generate6DigitCode(): string {
    return String(randomInt(0, 1_000_000)).padStart(6, '0');
  }

  private async toLoginResponse(user: User): Promise<LoginResponse> {
    const tokens = await this.issueTokens(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        emailVerified: user.emailVerified,
        defaultCurrency: user.defaultCurrency,
      },
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
        expiresIn: this.config.get<string>('jwt.refreshExpiresIn') ?? '7d',
      },
    );

    return { accessToken, refreshToken };
  }
}
