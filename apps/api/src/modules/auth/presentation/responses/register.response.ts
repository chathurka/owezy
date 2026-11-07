import { ApiProperty } from '@nestjs/swagger';

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
