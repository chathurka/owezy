import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { AppleTokenVerifier } from './apple-token.verifier';
import { EmailPort } from './email.port';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { RegisterDto } from '../presentation/dto/register.dto';

describe('AuthService', () => {
  const now = new Date('2026-11-07T12:00:00.000Z');

  const baseDto: RegisterDto = {
    fullName: 'Alex Morgan',
    email: 'alex@example.com',
    password: 'Lisbon2026',
    defaultCurrency: 'USD',
    acceptedTerms: true,
  };

  let users: jest.Mocked<UserRepository>;
  let email: jest.Mocked<EmailPort>;
  let jwt: JwtService;
  let config: ConfigService;
  let appleTokens: jest.Mocked<AppleTokenVerifier>;
  let service: AuthService;

  beforeEach(() => {
    users = {
      findActiveByEmail: jest.fn(),
      findActiveByAppleSubject: jest.fn(),
      findAppleSubjectByUserId: jest.fn(),
      createUserWithVerificationToken: jest.fn(),
      createAppleUser: jest.fn(),
      linkAppleIdentity: jest.fn(),
      consumeVerificationToken: jest.fn(),
      rotateVerificationToken: jest.fn(),
      findLatestVerificationTokenCreatedAt: jest.fn(),
      markEmailVerified: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    email = {
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EmailPort>;

    jwt = {
      signAsync: jest.fn().mockResolvedValue('access.jwt'),
    } as unknown as JwtService;
    (jwt.signAsync as jest.Mock)
      .mockResolvedValueOnce('access.jwt')
      .mockResolvedValueOnce('refresh.jwt')
      .mockResolvedValueOnce('access.jwt')
      .mockResolvedValueOnce('refresh.jwt')
      .mockResolvedValueOnce('access.jwt')
      .mockResolvedValueOnce('refresh.jwt')
      .mockResolvedValueOnce('access.jwt')
      .mockResolvedValueOnce('refresh.jwt')
      .mockResolvedValueOnce('access.jwt')
      .mockResolvedValueOnce('refresh.jwt')
      .mockResolvedValueOnce('access.jwt')
      .mockResolvedValueOnce('refresh.jwt');

    config = {
      get: jest.fn((key: string) => {
        const map: Record<string, string | number> = {
          'email.verificationCodeTtl': 900,
          'email.resendCooldownSecs': 60,
          'jwt.accessSecret': 'access-secret',
          'jwt.accessExpiresIn': '15m',
          'jwt.refreshSecret': 'refresh-secret',
          'jwt.refreshExpiresIn': '7d',
        };
        return map[key];
      }),
    } as unknown as ConfigService;

    appleTokens = {
      verify: jest.fn(),
    } as unknown as jest.Mocked<AppleTokenVerifier>;

    service = new AuthService(users, email, jwt, config, appleTokens);
  });

  it('creates a user, returns tokens, and initiates verification email', async () => {
    users.findActiveByEmail.mockResolvedValue(null);
    users.createUserWithVerificationToken.mockResolvedValue(
      new User(
        '11111111-1111-4111-8111-111111111111',
        'alex@example.com',
        'hashed',
        'Alex Morgan',
        'user',
        false,
        'USD',
        now,
        now,
        null,
      ),
    );

    const result = await service.register(baseDto);

    expect(users.createUserWithVerificationToken).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'alex@example.com',
        fullName: 'Alex Morgan',
        role: 'user',
        emailVerified: false,
        defaultCurrency: 'USD',
      }),
      expect.objectContaining({
        tokenHash: expect.any(String),
        expiresAt: expect.any(Date),
      }),
    );
    expect(email.sendVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'alex@example.com',
        fullName: 'Alex Morgan',
        verificationToken: expect.any(String),
      }),
    );
    expect(result).toEqual({
      accessToken: 'access.jwt',
      refreshToken: 'refresh.jwt',
      user: {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'alex@example.com',
        fullName: 'Alex Morgan',
        role: 'user',
        emailVerified: false,
        defaultCurrency: 'USD',
      },
      emailVerificationRequired: true,
    });
  });

  it('rejects duplicate email with conflict', async () => {
    users.findActiveByEmail.mockResolvedValue(
      new User(
        '11111111-1111-4111-8111-111111111111',
        'alex@example.com',
        'hashed',
        'Alex Morgan',
        'user',
        false,
        'USD',
        now,
        now,
        null,
      ),
    );

    await expect(service.register(baseDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(users.createUserWithVerificationToken).not.toHaveBeenCalled();
    expect(email.sendVerificationEmail).not.toHaveBeenCalled();
  });

  it('still returns tokens when verification email send fails', async () => {
    users.findActiveByEmail.mockResolvedValue(null);
    users.createUserWithVerificationToken.mockResolvedValue(
      new User(
        '11111111-1111-4111-8111-111111111111',
        'alex@example.com',
        'hashed',
        'Alex Morgan',
        'user',
        false,
        'USD',
        now,
        now,
        null,
      ),
    );
    email.sendVerificationEmail.mockRejectedValue(new Error('provider down'));

    const result = await service.register(baseDto);

    expect(result.accessToken).toBe('access.jwt');
    expect(result.emailVerificationRequired).toBe(true);
  });

  it('logs in with valid credentials and returns tokens', async () => {
    const passwordHash = await bcrypt.hash('Lisbon2026', 4);
    users.findActiveByEmail.mockResolvedValue(
      new User(
        '11111111-1111-4111-8111-111111111111',
        'alex@example.com',
        passwordHash,
        'Alex Morgan',
        'user',
        true,
        'USD',
        now,
        now,
        null,
      ),
    );

    const result = await service.login({
      email: 'alex@example.com',
      password: 'Lisbon2026',
    });

    expect(result).toEqual({
      accessToken: 'access.jwt',
      refreshToken: 'refresh.jwt',
      user: {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'alex@example.com',
        fullName: 'Alex Morgan',
        role: 'user',
        emailVerified: true,
        defaultCurrency: 'USD',
      },
    });
  });

  it('rejects wrong password with INVALID_CREDENTIALS', async () => {
    const passwordHash = await bcrypt.hash('Lisbon2026', 4);
    users.findActiveByEmail.mockResolvedValue(
      new User(
        '11111111-1111-4111-8111-111111111111',
        'alex@example.com',
        passwordHash,
        'Alex Morgan',
        'user',
        true,
        'USD',
        now,
        now,
        null,
      ),
    );

    try {
      await service.login({
        email: 'alex@example.com',
        password: 'WrongPass1',
      });
      fail('expected UnauthorizedException');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).getResponse()).toMatchObject({
        code: 'INVALID_CREDENTIALS',
      });
    }
  });

  it('rejects unknown email with INVALID_CREDENTIALS', async () => {
    users.findActiveByEmail.mockResolvedValue(null);

    try {
      await service.login({
        email: 'missing@example.com',
        password: 'Lisbon2026',
      });
      fail('expected UnauthorizedException');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).getResponse()).toMatchObject({
        code: 'INVALID_CREDENTIALS',
      });
    }
  });

  it('rejects password login when password hash is null', async () => {
    users.findActiveByEmail.mockResolvedValue(
      new User(
        '11111111-1111-4111-8111-111111111111',
        'alex@example.com',
        null,
        'Alex Morgan',
        'user',
        true,
        'USD',
        now,
        now,
        null,
      ),
    );

    await expect(
      service.login({ email: 'alex@example.com', password: 'Lisbon2026' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('creates a new Apple user when sub is unknown', async () => {
    appleTokens.verify.mockResolvedValue({
      sub: 'apple.sub.1',
      email: 'relay@privaterelay.appleid.com',
      emailVerified: true,
    });
    users.findActiveByAppleSubject.mockResolvedValue(null);
    users.findActiveByEmail.mockResolvedValue(null);
    users.createAppleUser.mockResolvedValue(
      new User(
        '22222222-2222-4222-8222-222222222222',
        'relay@privaterelay.appleid.com',
        null,
        'Alex',
        'user',
        true,
        'USD',
        now,
        now,
        null,
      ),
    );

    const result = await service.signInWithApple({
      identityToken: 'apple.jwt',
      fullName: 'Alex',
    });

    expect(users.createAppleUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'relay@privaterelay.appleid.com',
        appleSubject: 'apple.sub.1',
        emailVerified: true,
      }),
    );
    expect(result.user.id).toBe('22222222-2222-4222-8222-222222222222');
    expect(result.accessToken).toBe('access.jwt');
  });

  it('signs in existing Apple sub without creating a user', async () => {
    appleTokens.verify.mockResolvedValue({
      sub: 'apple.sub.1',
      emailVerified: true,
    });
    users.findActiveByAppleSubject.mockResolvedValue(
      new User(
        '22222222-2222-4222-8222-222222222222',
        'relay@privaterelay.appleid.com',
        null,
        'Alex',
        'user',
        true,
        'USD',
        now,
        now,
        null,
      ),
    );

    const result = await service.signInWithApple({ identityToken: 'apple.jwt' });

    expect(users.createAppleUser).not.toHaveBeenCalled();
    expect(result.user.email).toBe('relay@privaterelay.appleid.com');
  });

  it('links Apple to an existing email account', async () => {
    appleTokens.verify.mockResolvedValue({
      sub: 'apple.sub.2',
      email: 'alex@example.com',
      emailVerified: true,
    });
    users.findActiveByAppleSubject.mockResolvedValue(null);
    users.findActiveByEmail.mockResolvedValue(
      new User(
        '11111111-1111-4111-8111-111111111111',
        'alex@example.com',
        'hashed',
        'Alex Morgan',
        'user',
        true,
        'USD',
        now,
        now,
        null,
      ),
    );
    users.findAppleSubjectByUserId.mockResolvedValue(null);

    const result = await service.signInWithApple({ identityToken: 'apple.jwt' });

    expect(users.linkAppleIdentity).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      'apple.sub.2',
      'alex@example.com',
    );
    expect(result.user.id).toBe('11111111-1111-4111-8111-111111111111');
  });

  it('rejects Apple link conflicts', async () => {
    appleTokens.verify.mockResolvedValue({
      sub: 'apple.sub.new',
      email: 'alex@example.com',
      emailVerified: true,
    });
    users.findActiveByAppleSubject.mockResolvedValue(null);
    users.findActiveByEmail.mockResolvedValue(
      new User(
        '11111111-1111-4111-8111-111111111111',
        'alex@example.com',
        'hashed',
        'Alex Morgan',
        'user',
        true,
        'USD',
        now,
        now,
        null,
      ),
    );
    users.findAppleSubjectByUserId.mockResolvedValue('apple.sub.other');

    await expect(
      service.signInWithApple({ identityToken: 'apple.jwt' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects Apple sign-in without email for unknown sub', async () => {
    appleTokens.verify.mockResolvedValue({
      sub: 'apple.sub.new',
      emailVerified: false,
    });
    users.findActiveByAppleSubject.mockResolvedValue(null);

    await expect(
      service.signInWithApple({ identityToken: 'apple.jwt' }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('logout completes without throwing', async () => {
    await expect(service.logout()).resolves.toBeUndefined();
  });

  // ── verifyEmail ──────────────────────────────────────────────────────────

  it('verifies a valid token and returns email + emailVerified true', async () => {
    users.consumeVerificationToken.mockResolvedValue({
      userId: '11111111-1111-4111-8111-111111111111',
      email: 'alex@example.com',
    });
    users.markEmailVerified.mockResolvedValue({ email: 'alex@example.com' });

    const result = await service.verifyEmail('123456');

    expect(result).toEqual({ email: 'alex@example.com', emailVerified: true });
    expect(users.consumeVerificationToken).toHaveBeenCalledWith(
      expect.any(String), // sha256 hash
    );
    expect(users.markEmailVerified).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
    );
  });

  it('throws BadRequestException with VERIFICATION_TOKEN_INVALID for invalid token', async () => {
    users.consumeVerificationToken.mockResolvedValue(null);

    try {
      await service.verifyEmail('000000');
      fail('expected BadRequestException');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toMatchObject({
        code: 'VERIFICATION_TOKEN_INVALID',
      });
    }
    expect(users.markEmailVerified).not.toHaveBeenCalled();
  });

  // ── resendVerification ──────────────────────────────────────────────────

  it('resends verification email when cooldown has elapsed', async () => {
    const oldToken = new Date(Date.now() - 120_000); // 2 minutes ago
    users.findLatestVerificationTokenCreatedAt.mockResolvedValue({
      userId: '11111111-1111-4111-8111-111111111111',
      createdAt: oldToken,
    });
    users.rotateVerificationToken.mockResolvedValue(undefined);
    users.findActiveByEmail.mockResolvedValue(
      new User(
        '11111111-1111-4111-8111-111111111111',
        'alex@example.com',
        'hashed',
        'Alex Morgan',
        'user',
        false,
        'USD',
        now,
        now,
        null,
      ),
    );

    await service.resendVerification('alex@example.com');

    expect(users.rotateVerificationToken).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      expect.any(String),
      expect.any(Date),
    );
    expect(email.sendVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'alex@example.com' }),
    );
  });

  it('skips resend when within cooldown period', async () => {
    const recentToken = new Date(Date.now() - 10_000); // 10 seconds ago
    users.findLatestVerificationTokenCreatedAt.mockResolvedValue({
      userId: '11111111-1111-4111-8111-111111111111',
      createdAt: recentToken,
    });

    await service.resendVerification('alex@example.com');

    expect(users.rotateVerificationToken).not.toHaveBeenCalled();
    expect(email.sendVerificationEmail).not.toHaveBeenCalled();
  });

  it('returns without sending when no unverified user found (non-enumerating)', async () => {
    users.findLatestVerificationTokenCreatedAt.mockResolvedValue(null);

    await service.resendVerification('nobody@example.com');

    expect(users.rotateVerificationToken).not.toHaveBeenCalled();
    expect(email.sendVerificationEmail).not.toHaveBeenCalled();
  });
});
