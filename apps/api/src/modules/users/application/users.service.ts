import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '../../auth/domain/user.entity';
import { UserRepository } from '../../auth/domain/user.repository';
import { UpdateProfileDto } from '../presentation/dto/update-profile.dto';
import { UserProfileResponse } from '../presentation/responses/user-profile.response';

@Injectable()
export class UsersService {
  constructor(private readonly users: UserRepository) {}

  async getMe(userId: string): Promise<UserProfileResponse> {
    const user = await this.users.findActiveById(userId);
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }
    return this.toProfile(user);
  }

  async updateMe(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserProfileResponse> {
    if (dto.fullName !== undefined && dto.fullName.trim().length === 0) {
      throw new UnprocessableEntityException({
        code: 'VALIDATION_FAILED',
        message: 'fullName is required',
        details: [
          { field: 'fullName', messages: ['fullName must not be empty'] },
        ],
      });
    }

    try {
      const user = await this.users.updateProfile(userId, {
        fullName: dto.fullName?.trim(),
        phone: dto.phone,
        paymentHandle: dto.paymentHandle,
        defaultCurrency: dto.defaultCurrency,
        preferredLocale: dto.preferredLocale,
        completeSetup: dto.completeSetup === true,
        completeGroupOnboarding: dto.completeGroupOnboarding === true,
      });
      return this.toProfile(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        });
      }
      throw error;
    }
  }

  toProfile(user: User): UserProfileResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      emailVerified: user.emailVerified,
      defaultCurrency: user.defaultCurrency,
      preferredLocale: user.preferredLocale,
      phone: user.phone,
      paymentHandle: user.paymentHandle,
      avatarUrl: user.avatarUrl,
      profileSetupCompletedAt: user.profileSetupCompletedAt
        ? user.profileSetupCompletedAt.toISOString()
        : null,
      groupOnboardingCompletedAt: user.groupOnboardingCompletedAt
        ? user.groupOnboardingCompletedAt.toISOString()
        : null,
    };
  }
}
