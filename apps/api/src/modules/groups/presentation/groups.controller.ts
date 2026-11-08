import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
}
