import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class JoinGroupDto {
  @ApiProperty({ minLength: 4, maxLength: 16 })
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  inviteCode!: string;
}
