import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty({ minLength: 16 })
  @IsString()
  @MinLength(16)
  token!: string;
}
