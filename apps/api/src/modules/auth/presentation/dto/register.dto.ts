import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsIn,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export const ALLOWED_CURRENCIES = ['USD', 'EUR', 'GBP', 'LKR', 'INR'] as const;

export class RegisterDto {
  @ApiProperty({ minLength: 2, maxLength: 100, example: 'Alex Morgan' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName!: string;

  @ApiProperty({ format: 'email', example: 'you@example.com' })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({
    minLength: 8,
    description: 'At least 8 characters, one uppercase letter, and one digit',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'password must include at least one uppercase letter and one digit',
  })
  password!: string;

  @ApiProperty({ enum: ALLOWED_CURRENCIES })
  @IsIn([...ALLOWED_CURRENCIES])
  defaultCurrency!: (typeof ALLOWED_CURRENCIES)[number];

  @ApiProperty({ description: 'Must be true' })
  @IsBoolean()
  @Equals(true, { message: 'acceptedTerms must be true' })
  acceptedTerms!: boolean;
}
