import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponse {
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: true })
  emailVerified!: true;
}
