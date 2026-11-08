import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ description: 'The refresh JWT issued at login' })
  @IsString()
  @MinLength(1)
  refreshToken!: string;
}
