import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty({ enum: ['user'] })
  role!: 'user';

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
}

export class RegisterResponse {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ type: RegisterUserResponse })
  user!: RegisterUserResponse;

  @ApiProperty({ example: true })
  emailVerificationRequired!: true;
}
