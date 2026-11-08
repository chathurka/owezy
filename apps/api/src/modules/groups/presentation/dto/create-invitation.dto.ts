import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiPropertyOptional({ format: 'email', nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string | null;
}
