import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { Role } from '../../../core/auth/role.enum';
import { AuthService } from '../application/auth.service';
import { ProvisionAdminDto } from './dto/provision-admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller({ path: 'admin/accounts', version: '1' })
export class AdminAccountsController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Provision an admin account' })
  @ApiCreatedResponse({ description: 'Admin created' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiConflictResponse()
  @ApiUnprocessableEntityResponse()
  provision(@Body() dto: ProvisionAdminDto) {
    return this.authService.provisionAdmin(dto);
  }
}
