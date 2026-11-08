import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: '6-digit verification code or opaque token',
    minLength: 1,
    maxLength: 128,
    example: '123456',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  token!: string;
}
