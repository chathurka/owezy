import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { UserRepository } from '../../auth/domain/user.repository';
import {
  Group,
  GroupInvitation,
  GroupOverview,
} from '../domain/group.entity';
import { GroupRepository } from '../domain/group.repository';
import { CreateGroupDto } from '../presentation/dto/create-group.dto';
import { CreateInvitationDto } from '../presentation/dto/create-invitation.dto';
import { JoinGroupDto } from '../presentation/dto/join-group.dto';

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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

  async listInvitations(
    userId: string,
    groupId: string,
  ): Promise<{ items: GroupInvitation[] }> {
    await this.requireMembership(userId, groupId);
    const items = await this.groups.listInvitations(groupId);
    return { items };
  }

  async createInvitation(
    userId: string,
    groupId: string,
    dto: CreateInvitationDto,
  ): Promise<GroupInvitation> {
    await this.requireMembership(userId, groupId);
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const invitation = await this.groups.createInvitation({
      id: dto.id,
      groupId,
      invitedBy: userId,
      email: dto.email?.trim() || null,
      tokenHash,
      expiresAt: new Date(Date.now() + INVITE_TTL_MS),
    });
    return new GroupInvitation(
      invitation.id,
      invitation.groupId,
      invitation.email,
      invitation.status,
      invitation.expiresAt,
      invitation.createdAt,
      token,
    );
  }

  async revokeInvitation(
    userId: string,
    groupId: string,
    invitationId: string,
  ): Promise<GroupInvitation> {
    await this.requireMembership(userId, groupId);
    const invitation = await this.groups.findInvitation(groupId, invitationId);
    if (!invitation) {
      throw new NotFoundException({
        code: 'INVITATION_NOT_FOUND',
        message: 'Invitation not found',
      });
    }
    if (invitation.status !== 'pending') {
      throw new ConflictException({
        code: 'INVITATION_NOT_PENDING',
        message: 'Invitation cannot be revoked',
      });
    }
    if (invitation.expiresAt < new Date()) {
      throw new ConflictException({
        code: 'INVITATION_NOT_PENDING',
        message: 'Invitation cannot be revoked',
      });
    }
    await this.groups.updateInvitationStatus(invitationId, 'revoked');
    return new GroupInvitation(
      invitation.id,
      invitation.groupId,
      invitation.email,
      'revoked',
      invitation.expiresAt,
      invitation.createdAt,
    );
  }

  private async requireMembership(userId: string, groupId: string) {
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
    return membership;
  }

  private generateInviteCode(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }
}
