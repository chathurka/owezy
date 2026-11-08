import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ALLOWED_CURRENCIES } from '../../../auth/presentation/dto/register.dto';

export class UpdateProfileDto {
  @ApiPropertyOptional({ minLength: 1, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({ nullable: true, maxLength: 32 })
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(32)
  phone?: string | null;

  @ApiPropertyOptional({ nullable: true, maxLength: 64 })
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(64)
  paymentHandle?: string | null;

  @ApiPropertyOptional({ enum: ALLOWED_CURRENCIES })
  @IsOptional()
  @IsIn([...ALLOWED_CURRENCIES])
  defaultCurrency?: (typeof ALLOWED_CURRENCIES)[number];

  @ApiPropertyOptional({ enum: ['en', 'si'] })
  @IsOptional()
  @IsIn(['en', 'si'])
  preferredLocale?: 'en' | 'si';

  @ApiPropertyOptional({
    description: 'When true, sets profileSetupCompletedAt if not already set.',
  })
  @IsOptional()
  @IsBoolean()
  completeSetup?: boolean;

  @ApiPropertyOptional({
    description:
      'When true, sets groupOnboardingCompletedAt if not already set (skip/create/join).',
  })
  @IsOptional()
  @IsBoolean()
  completeGroupOnboarding?: boolean;
}
