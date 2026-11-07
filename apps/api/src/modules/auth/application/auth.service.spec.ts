import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
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
  let service: AuthService;

  beforeEach(() => {
    users = {
      findActiveByEmail: jest.fn(),
      createUserWithVerificationToken: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    email = {
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EmailPort>;

    jwt = {
      signAsync: jest
        .fn()
        .mockResolvedValueOnce('access.jwt')
        .mockResolvedValueOnce('refresh.jwt')
        .mockResolvedValueOnce('access.jwt')
        .mockResolvedValueOnce('refresh.jwt'),
    } as unknown as JwtService;

    config = {
      get: jest.fn((key: string) => {
        const map: Record<string, string | number> = {
          'email.verificationCodeTtl': 900,
          'jwt.accessSecret': 'access-secret',
          'jwt.accessExpiresIn': '15m',
          'jwt.refreshSecret': 'refresh-secret',
          'jwt.refreshExpiresIn': '7d',
        };
        return map[key];
      }),
    } as unknown as ConfigService;

    service = new AuthService(users, email, jwt, config);
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

  it('logout completes without throwing', async () => {
    await expect(service.logout()).resolves.toBeUndefined();
  });
});
