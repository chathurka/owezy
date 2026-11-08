import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { UserRepository } from '../../auth/domain/user.repository';
import { Group, GroupOverview } from '../domain/group.entity';
import { GroupRepository } from '../domain/group.repository';
import { CreateGroupDto } from '../presentation/dto/create-group.dto';
import { JoinGroupDto } from '../presentation/dto/join-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groups: GroupRepository,
    private readonly users: UserRepository,
  ) {}

  async listMine(userId: string): Promise<{ items: Group[] }> {
    const items = await this.groups.listForUser(userId);
    return { items };
  }

  async getOverview(userId: string, groupId: string): Promise<GroupOverview> {
    const membership = await this.groups.findMembership(groupId, userId);
    if (!membership) {
      throw new NotFoundException({
        code: 'GROUP_NOT_FOUND',
        message: 'Group not found',
      });
    }
    const group = await this.groups.findById(groupId);
    if (!group || group.deletedAt) {
      throw new NotFoundException({
        code: 'GROUP_NOT_FOUND',
        message: 'Group not found',
      });
    }
    const memberCount = await this.groups.countActiveMembers(groupId);
    return new GroupOverview(
      group.id,
      group.name,
      group.inviteCode,
      membership.role,
      memberCount,
      true,
    );
  }

  async create(userId: string, dto: CreateGroupDto): Promise<Group> {
    const name = dto.name.trim();
    if (!name) {
      throw new UnprocessableEntityException({
        code: 'VALIDATION_FAILED',
        message: 'name is required',
        details: [{ field: 'name', messages: ['name must not be empty'] }],
      });
    }

    const existing = await this.groups.findById(dto.id);
    if (existing) {
      if (existing.deletedAt || existing.createdBy !== userId) {
        throw new ConflictException({
          code: 'GROUP_ID_CONFLICT',
          message: 'Group id is already in use',
        });
      }
      const membership = await this.groups.findMembership(existing.id, userId);
      await this.users.updateProfile(userId, {
        completeGroupOnboarding: true,
      });
      const memberCount = await this.groups.countActiveMembers(existing.id);
      return new Group(
        existing.id,
        existing.name,
        existing.inviteCode,
        existing.createdBy,
        membership?.role ?? 'owner',
        memberCount,
      );
    }

    const group = await this.groups.createGroup({
      id: dto.id,
      name,
      inviteCode: this.generateInviteCode(),
      createdBy: userId,
      memberId: randomUUID(),
    });

    await this.users.updateProfile(userId, {
      completeGroupOnboarding: true,
    });

    return group;
  }

  async join(userId: string, dto: JoinGroupDto): Promise<Group> {
    const found = await this.groups.findActiveByInviteCode(dto.inviteCode);
    if (!found) {
      throw new NotFoundException({
        code: 'GROUP_NOT_FOUND',
        message: 'Group not found',
      });
    }

    const existing = await this.groups.findMembership(found.id, userId);
    if (!existing) {
      await this.groups.addMember({
        id: randomUUID(),
        groupId: found.id,
        userId,
        role: 'member',
      });
    }

    await this.users.updateProfile(userId, {
      completeGroupOnboarding: true,
    });

    const memberCount = await this.groups.countActiveMembers(found.id);
    return new Group(
      found.id,
      found.name,
      found.inviteCode,
      found.createdBy,
      existing?.role ?? 'member',
      memberCount,
    );
  }

  private generateInviteCode(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }
}
