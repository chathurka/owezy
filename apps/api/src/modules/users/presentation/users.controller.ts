import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  AuthUser,
  CurrentUser,
} from '../../../core/auth/decorators/current-user.decorator';
import { UsersService } from '../application/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfileResponse } from './responses/user-profile.response';

@ApiTags('Users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserProfileResponse })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  getMe(@CurrentUser() user: AuthUser): Promise<UserProfileResponse> {
    return this.usersService.getMe(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ type: UserProfileResponse })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiUnprocessableEntityResponse()
  updateMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserProfileResponse> {
    return this.usersService.updateMe(user.userId, dto);
  }
}
