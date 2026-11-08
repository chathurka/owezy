import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class MfaVerifyDto {
  @ApiProperty({ minLength: 6, maxLength: 8 })
  @IsString()
  @MinLength(6)
  @MaxLength(8)
  code!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mfaToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  setup?: boolean;
}
