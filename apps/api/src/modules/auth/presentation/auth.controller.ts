import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { AuthService } from '../application/auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponse } from './responses/register.response';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register with email and password' })
  @ApiCreatedResponse({ type: RegisterResponse })
  @ApiConflictResponse({ description: 'Email already registered' })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }
}
