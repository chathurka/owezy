import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '../../auth/domain/user.entity';
import { UserRepository } from '../../auth/domain/user.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const now = new Date('2026-11-08T12:00:00.000Z');
  const userId = '11111111-1111-4111-8111-111111111111';

  let users: jest.Mocked<UserRepository>;
  let service: UsersService;

  const baseUser = new User(
    userId,
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

  beforeEach(() => {
    users = {
      findActiveById: jest.fn(),
      updateProfile: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;
    service = new UsersService(users);
  });

  it('getMe returns profile', async () => {
    users.findActiveById.mockResolvedValue(baseUser);

    const result = await service.getMe(userId);

    expect(result).toMatchObject({
      id: userId,
      email: 'alex@example.com',
      fullName: 'Alex Morgan',
      defaultCurrency: 'USD',
      preferredLocale: 'en',
      profileSetupCompletedAt: null,
      groupOnboardingCompletedAt: null,
      phone: null,
      paymentHandle: null,
      avatarUrl: null,
    });
  });

  it('getMe throws when user missing', async () => {
    users.findActiveById.mockResolvedValue(null);
    await expect(service.getMe(userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updateMe updates fullName and completes setup', async () => {
    const completedAt = new Date('2026-11-08T12:05:00.000Z');
    users.updateProfile.mockResolvedValue(
      new User(
        userId,
        'alex@example.com',
        'hashed',
        'Alex M',
        'user',
        true,
        'USD',
        now,
        now,
        null,
        false,
        null,
        null,
        null,
        null,
        completedAt,
      ),
    );

    const result = await service.updateMe(userId, {
      fullName: 'Alex M',
      completeSetup: true,
    });

    expect(users.updateProfile).toHaveBeenCalledWith(userId, {
      fullName: 'Alex M',
      phone: undefined,
      paymentHandle: undefined,
      defaultCurrency: undefined,
      preferredLocale: undefined,
      completeSetup: true,
      completeGroupOnboarding: false,
    });
    expect(result.fullName).toBe('Alex M');
    expect(result.profileSetupCompletedAt).toBe(completedAt.toISOString());
  });

  it('updateMe updates defaultCurrency', async () => {
    users.updateProfile.mockResolvedValue(
      new User(
        userId,
        'alex@example.com',
        'hashed',
        'Alex Morgan',
        'user',
        true,
        'EUR',
        now,
        now,
        null,
      ),
    );

    const result = await service.updateMe(userId, { defaultCurrency: 'EUR' });

    expect(users.updateProfile).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({ defaultCurrency: 'EUR' }),
    );
    expect(result.defaultCurrency).toBe('EUR');
  });

  it('updateMe rejects whitespace-only fullName', async () => {
    await expect(
      service.updateMe(userId, { fullName: '   ' }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
    expect(users.updateProfile).not.toHaveBeenCalled();
  });
});
