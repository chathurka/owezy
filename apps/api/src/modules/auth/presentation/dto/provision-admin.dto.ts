import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ProvisionAdminDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({ minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/)
  password!: string;

  @ApiProperty({ minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName!: string;
}
