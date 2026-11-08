import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { AppleTokenVerifier } from './apple-token.verifier';
import { EmailPort } from './email.port';
import { GoogleTokenVerifier } from './google-token.verifier';
import { User } from '../domain/user.entity';
import { RefreshTokenRepository } from '../domain/refresh-token.repository';
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
  let googleTokens: jest.Mocked<GoogleTokenVerifier>;
  let refreshTokens: jest.Mocked<RefreshTokenRepository>;
  let service: AuthService;

  beforeEach(() => {
    users = {
      findActiveByEmail: jest.fn(),
      findActiveById: jest.fn(),
      findActiveByAppleSubject: jest.fn(),
      findAppleSubjectByUserId: jest.fn(),
      findActiveByGoogleSubject: jest.fn(),
      findGoogleSubjectByUserId: jest.fn(),
      createUserWithVerificationToken: jest.fn(),
      createAppleUser: jest.fn(),
      createGoogleUser: jest.fn(),
      linkAppleIdentity: jest.fn(),
      linkGoogleIdentity: jest.fn(),
      consumeVerificationToken: jest.fn(),
      rotateVerificationToken: jest.fn(),
      findLatestVerificationTokenCreatedAt: jest.fn(),
      markEmailVerified: jest.fn(),
      createPasswordResetToken: jest.fn().mockResolvedValue(undefined),
      findLatestPasswordResetTokenCreatedAt: jest.fn(),
      consumePasswordResetToken: jest.fn(),
      updatePasswordHash: jest.fn().mockResolvedValue(undefined),
      countActiveAdmins: jest.fn().mockResolvedValue(1),
      createAdminUser: jest.fn(),
      updateMfaSecret: jest.fn().mockResolvedValue(undefined),
      updateProfile: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    email = {
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
      sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EmailPort>;

    refreshTokens = {
      store: jest.fn().mockResolvedValue(undefined),
      findValid: jest.fn(),
      revoke: jest.fn().mockResolvedValue(undefined),
      revokeByHash: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<RefreshTokenRepository>;

    jwt = {
      signAsync: jest.fn().mockResolvedValue('access.jwt'),
      verifyAsync: jest.fn(),
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
          'passwordReset.ttlSecs': 1800,
          'passwordReset.cooldownSecs': 60,
          'admin.bootstrapEmail': '',
          'admin.bootstrapPassword': '',
        };
        return map[key];
      }),
    } as unknown as ConfigService;

    appleTokens = {
      verify: jest.fn(),
    } as unknown as jest.Mocked<AppleTokenVerifier>;

    googleTokens = {
      verify: jest.fn(),
    } as unknown as jest.Mocked<GoogleTokenVerifier>;

    service = new AuthService(
      users,
      email,
      jwt,
      config,
      appleTokens,
      googleTokens,
      refreshTokens,
    );
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
        preferredLocale: 'en',
        phone: null,
        paymentHandle: null,
        avatarUrl: null,
        profileSetupCompletedAt: null,
        groupOnboardingCompletedAt: null,
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
        preferredLocale: 'en',
        phone: null,
        paymentHandle: null,
        avatarUrl: null,
        profileSetupCompletedAt: null,
        groupOnboardingCompletedAt: null,
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

  it('creates a new Google user when sub is unknown', async () => {
    googleTokens.verify.mockResolvedValue({
      sub: 'google.sub.1',
      email: 'alex@example.com',
      emailVerified: true,
    });
    users.findActiveByGoogleSubject.mockResolvedValue(null);
    users.findActiveByEmail.mockResolvedValue(null);
    users.createGoogleUser.mockResolvedValue(
      new User(
        '33333333-3333-4333-8333-333333333333',
        'alex@example.com',
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

    const result = await service.signInWithGoogle({
      idToken: 'google.jwt',
      fullName: 'Alex',
    });

    expect(users.createGoogleUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'alex@example.com',
        googleSubject: 'google.sub.1',
        emailVerified: true,
      }),
    );
    expect(result.user.id).toBe('33333333-3333-4333-8333-333333333333');
    expect(result.accessToken).toBe('access.jwt');
  });

  it('signs in existing Google sub without creating a user', async () => {
    googleTokens.verify.mockResolvedValue({
      sub: 'google.sub.1',
      emailVerified: true,
    });
    users.findActiveByGoogleSubject.mockResolvedValue(
      new User(
        '33333333-3333-4333-8333-333333333333',
        'alex@example.com',
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

    const result = await service.signInWithGoogle({ idToken: 'google.jwt' });

    expect(users.createGoogleUser).not.toHaveBeenCalled();
    expect(result.user.email).toBe('alex@example.com');
  });

  it('links Google to an existing email account', async () => {
    googleTokens.verify.mockResolvedValue({
      sub: 'google.sub.2',
      email: 'alex@example.com',
      emailVerified: true,
    });
    users.findActiveByGoogleSubject.mockResolvedValue(null);
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
    users.findGoogleSubjectByUserId.mockResolvedValue(null);

    const result = await service.signInWithGoogle({ idToken: 'google.jwt' });

    expect(users.linkGoogleIdentity).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      'google.sub.2',
      'alex@example.com',
    );
    expect(result.user.id).toBe('11111111-1111-4111-8111-111111111111');
  });

  it('rejects Google link conflicts', async () => {
    googleTokens.verify.mockResolvedValue({
      sub: 'google.sub.new',
      email: 'alex@example.com',
      emailVerified: true,
    });
    users.findActiveByGoogleSubject.mockResolvedValue(null);
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
    users.findGoogleSubjectByUserId.mockResolvedValue('google.sub.other');

    await expect(
      service.signInWithGoogle({ idToken: 'google.jwt' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects Google sign-in without verified email for unknown sub', async () => {
    googleTokens.verify.mockResolvedValue({
      sub: 'google.sub.new',
      email: 'alex@example.com',
      emailVerified: false,
    });
    users.findActiveByGoogleSubject.mockResolvedValue(null);

    await expect(
      service.signInWithGoogle({ idToken: 'google.jwt' }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('rejects invalid Google token', async () => {
    googleTokens.verify.mockRejectedValue(
      new UnauthorizedException({
        code: 'INVALID_GOOGLE_TOKEN',
        message: 'Google ID token is invalid',
      }),
    );

    await expect(
      service.signInWithGoogle({ idToken: 'bad.jwt' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('logout with refresh token revokes the hash', async () => {
    await service.logout('some.refresh.jwt');
    expect(refreshTokens.revokeByHash).toHaveBeenCalledWith(expect.any(String));
  });

  it('logout without refresh token completes without calling revokeByHash', async () => {
    await service.logout(undefined);
    expect(refreshTokens.revokeByHash).not.toHaveBeenCalled();
  });

  // ── refresh ──────────────────────────────────────────────────────────────

  it('refresh returns new tokens when refresh token is valid', async () => {
    const user = new User(
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
    );
    (jwt.verifyAsync as jest.Mock).mockResolvedValue({
      sub: user.id,
      type: 'refresh',
    });
    refreshTokens.findValid.mockResolvedValue({
      id: 'token-id-1',
      userId: user.id,
    });
    users.findActiveById.mockResolvedValue(user);

    const result = await service.refresh('valid.refresh.jwt');

    expect(refreshTokens.revoke).toHaveBeenCalledWith('token-id-1');
    expect(refreshTokens.store).toHaveBeenCalled();
    expect(result).toMatchObject({
      accessToken: 'access.jwt',
      refreshToken: 'refresh.jwt',
    });
  });

  it('refresh throws SESSION_EXPIRED when JWT signature is invalid', async () => {
    (jwt.verifyAsync as jest.Mock).mockRejectedValue(new Error('invalid'));

    try {
      await service.refresh('bad.token');
      fail('expected UnauthorizedException');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).getResponse()).toMatchObject({
        code: 'SESSION_EXPIRED',
      });
    }
  });

  it('refresh throws SESSION_EXPIRED when token type is not refresh', async () => {
    (jwt.verifyAsync as jest.Mock).mockResolvedValue({
      sub: '11111111-1111-4111-8111-111111111111',
      type: 'access',
    });

    await expect(service.refresh('wrong.type.jwt')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('refresh throws SESSION_EXPIRED when hash not found in DB (revoked)', async () => {
    (jwt.verifyAsync as jest.Mock).mockResolvedValue({
      sub: '11111111-1111-4111-8111-111111111111',
      type: 'refresh',
    });
    refreshTokens.findValid.mockResolvedValue(null);

    try {
      await service.refresh('revoked.refresh.jwt');
      fail('expected UnauthorizedException');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect((error as UnauthorizedException).getResponse()).toMatchObject({
        code: 'SESSION_EXPIRED',
      });
    }
  });

  it('refresh stores token hash on issueTokens during login', async () => {
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

    await service.login({ email: 'alex@example.com', password: 'Lisbon2026' });

    expect(refreshTokens.store).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      expect.any(String), // SHA-256 hash
      expect.any(Date),
    );
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

  // ── forgotPassword ──────────────────────────────────────────────────────

  it('sends reset email when active user exists and cooldown has elapsed', async () => {
    const oldToken = new Date(Date.now() - 120_000); // 2 minutes ago
    users.findLatestPasswordResetTokenCreatedAt.mockResolvedValue({
      userId: '11111111-1111-4111-8111-111111111111',
      createdAt: oldToken,
    });
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

    await service.forgotPassword('alex@example.com');

    expect(users.createPasswordResetToken).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      expect.any(String), // SHA-256 hash
      expect.any(Date),
    );
    expect(email.sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'alex@example.com',
        fullName: 'Alex Morgan',
        resetToken: expect.any(String),
      }),
    );
  });

  it('skips reset email when within cooldown period', async () => {
    const recentToken = new Date(Date.now() - 10_000); // 10 seconds ago
    users.findLatestPasswordResetTokenCreatedAt.mockResolvedValue({
      userId: '11111111-1111-4111-8111-111111111111',
      createdAt: recentToken,
    });

    await service.forgotPassword('alex@example.com');

    expect(users.createPasswordResetToken).not.toHaveBeenCalled();
    expect(email.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('returns without error for unknown email (non-enumerating)', async () => {
    users.findLatestPasswordResetTokenCreatedAt.mockResolvedValue(null);

    await expect(
      service.forgotPassword('nobody@example.com'),
    ).resolves.toBeUndefined();

    expect(users.createPasswordResetToken).not.toHaveBeenCalled();
    expect(email.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('still completes when reset email send fails', async () => {
    const oldToken = new Date(Date.now() - 120_000);
    users.findLatestPasswordResetTokenCreatedAt.mockResolvedValue({
      userId: '11111111-1111-4111-8111-111111111111',
      createdAt: oldToken,
    });
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
    email.sendPasswordResetEmail.mockRejectedValue(new Error('provider down'));

    await expect(
      service.forgotPassword('alex@example.com'),
    ).resolves.toBeUndefined();

    expect(users.createPasswordResetToken).toHaveBeenCalled();
  });

  // ── resetPassword ───────────────────────────────────────────────────────

  it('resets password with valid token and strong password', async () => {
    users.consumePasswordResetToken.mockResolvedValue({
      userId: '11111111-1111-4111-8111-111111111111',
    });

    await service.resetPassword('valid-reset-token-hex', 'NewPass1');

    expect(users.consumePasswordResetToken).toHaveBeenCalledWith(
      expect.any(String), // SHA-256 hash of token
    );
    expect(users.updatePasswordHash).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      expect.any(String), // bcrypt hash
    );
  });

  it('throws BadRequestException with RESET_TOKEN_INVALID for invalid token', async () => {
    users.consumePasswordResetToken.mockResolvedValue(null);

    try {
      await service.resetPassword('invalid-token', 'NewPass1');
      fail('expected BadRequestException');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toMatchObject({
        code: 'RESET_TOKEN_INVALID',
      });
    }
    expect(users.updatePasswordHash).not.toHaveBeenCalled();
  });

  it('throws UnprocessableEntityException for weak password (too short)', async () => {
    users.consumePasswordResetToken.mockResolvedValue({
      userId: '11111111-1111-4111-8111-111111111111',
    });

    await expect(
      service.resetPassword('valid-token', 'short'),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    expect(users.consumePasswordResetToken).not.toHaveBeenCalled();
    expect(users.updatePasswordHash).not.toHaveBeenCalled();
  });

  it('throws UnprocessableEntityException for password without uppercase', async () => {
    await expect(
      service.resetPassword('valid-token', 'nouppercase1'),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    expect(users.updatePasswordHash).not.toHaveBeenCalled();
  });

  it('throws UnprocessableEntityException for password without digit', async () => {
    await expect(
      service.resetPassword('valid-token', 'NoDigitHere'),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    expect(users.updatePasswordHash).not.toHaveBeenCalled();
  });

  it('hashes the new password before storing', async () => {
    users.consumePasswordResetToken.mockResolvedValue({
      userId: '11111111-1111-4111-8111-111111111111',
    });

    await service.resetPassword('valid-token', 'SecurePass1');

    const storedHash = (users.updatePasswordHash as jest.Mock).mock.calls[0][1] as string;
    // bcrypt hashes start with $2b$
    expect(storedHash).toMatch(/^\$2[ab]\$/);
    // The plain password must NOT be stored
    expect(storedHash).not.toBe('SecurePass1');
  });

  it('returns MFA challenge when admin has MFA enabled', async () => {
    const passwordHash = await bcrypt.hash('AdminPass1', 4);
    users.findActiveByEmail.mockResolvedValue(
      new User(
        '33333333-3333-4333-8333-333333333333',
        'admin@example.com',
        passwordHash,
        'Admin',
        'admin',
        true,
        'USD',
        now,
        now,
        null,
        true,
        'JBSWY3DPEHPK3PXP',
      ),
    );
    const result = await service.login({
      email: 'admin@example.com',
      password: 'AdminPass1',
    });

    expect(result.mfaRequired).toBe(true);
    expect(result.mfaToken).toEqual(expect.any(String));
    expect(result.accessToken).toBeUndefined();
  });

  it('provisions an admin account', async () => {
    users.findActiveByEmail.mockResolvedValue(null);
    users.createAdminUser.mockResolvedValue(
      new User(
        '33333333-3333-4333-8333-333333333333',
        'admin@example.com',
        'hashed',
        'Admin User',
        'admin',
        true,
        'USD',
        now,
        now,
        null,
      ),
    );

    const result = await service.provisionAdmin({
      email: 'admin@example.com',
      password: 'AdminPass1',
      fullName: 'Admin User',
    });

    expect(result.role).toBe('admin');
    expect(users.createAdminUser).toHaveBeenCalled();
  });
});
