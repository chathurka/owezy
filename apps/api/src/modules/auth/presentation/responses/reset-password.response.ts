import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponse {
  @ApiProperty({ enum: [true] })
  ok!: true;
}
