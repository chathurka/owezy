import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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
import { GroupsService } from '../application/groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JoinGroupDto } from './dto/join-group.dto';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller({ path: 'groups', version: '1' })
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List my groups' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  listMine(@CurrentUser() user: AuthUser) {
    return this.groupsService.listMine(user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a group' })
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiUnprocessableEntityResponse()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(user.userId, dto);
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join a group by invite code' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  join(@CurrentUser() user: AuthUser, @Body() dto: JoinGroupDto) {
    return this.groupsService.join(user.userId, dto);
  }

  @Get(':groupId/invitations')
  @ApiOperation({ summary: 'List group invitations' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  listInvitations(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ) {
    return this.groupsService.listInvitations(user.userId, groupId);
  }

  @Post(':groupId/invitations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a group invitation' })
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiUnprocessableEntityResponse()
  createInvitation(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.groupsService.createInvitation(user.userId, groupId, dto);
  }

  @Post(':groupId/invitations/:invitationId/revoke')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke a pending invitation' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  revokeInvitation(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('invitationId', ParseUUIDPipe) invitationId: string,
  ) {
    return this.groupsService.revokeInvitation(
      user.userId,
      groupId,
      invitationId,
    );
  }

  @Get(':groupId')
  @ApiOperation({ summary: 'Group overview for a member' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  getOverview(
    @CurrentUser() user: AuthUser,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ) {
    return this.groupsService.getOverview(user.userId, groupId);
  }
}
