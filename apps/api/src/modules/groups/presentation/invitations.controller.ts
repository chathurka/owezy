import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthUser,
  CurrentUser,
} from '../../../core/auth/decorators/current-user.decorator';
import { GroupsService } from '../application/groups.service';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller({ path: 'invitations', version: '1' })
export class InvitationsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a group invitation' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  accept(
    @CurrentUser() user: AuthUser,
    @Body() dto: AcceptInvitationDto,
  ) {
    return this.groupsService.acceptInvitation(user.userId, dto);
  }
}
