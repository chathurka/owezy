import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { UserRepository } from '../../auth/domain/user.repository';
import { Group } from '../domain/group.entity';
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

  async create(userId: string, dto: CreateGroupDto): Promise<Group> {
    const name = dto.name.trim();
    if (!name) {
      throw new UnprocessableEntityException({
        code: 'VALIDATION_FAILED',
        message: 'name is required',
        details: [{ field: 'name', messages: ['name must not be empty'] }],
      });
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

    return new Group(
      found.id,
      found.name,
      found.inviteCode,
      found.createdBy,
      existing?.role ?? 'member',
    );
  }

  private generateInviteCode(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }
}
