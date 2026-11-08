import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginUserResponse {
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
}

export class LoginResponse {
  @ApiPropertyOptional()
  accessToken?: string;

  @ApiPropertyOptional()
  refreshToken?: string;

  @ApiPropertyOptional({ type: LoginUserResponse })
  user?: LoginUserResponse;

  @ApiPropertyOptional()
  mfaRequired?: boolean;

  @ApiPropertyOptional()
  mfaToken?: string;
}
