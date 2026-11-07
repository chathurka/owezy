import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { LoginDto } from '../presentation/dto/login.dto';
import { RegisterDto } from '../presentation/dto/register.dto';
import { LoginResponse } from '../presentation/responses/login.response';
import { RegisterResponse } from '../presentation/responses/register.response';
import { EmailPort } from './email.port';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly users: UserRepository,
    private readonly email: EmailPort,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
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
    const verificationToken = randomBytes(32).toString('hex');
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
    if (!user) {
      throw this.invalidCredentials();
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw this.invalidCredentials();
    }

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

  async logout(): Promise<void> {
    // Refresh-token revocation is Phase 2 (ADR-0001). Clients clear local session.
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
