import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  role!: 'user' | 'admin';

  @ApiProperty()
  emailVerified!: boolean;

  @ApiProperty()
  defaultCurrency!: string;

  @ApiProperty({ enum: ['en', 'si'] })
  preferredLocale!: string;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  paymentHandle!: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl!: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  profileSetupCompletedAt!: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  groupOnboardingCompletedAt!: string | null;
}
