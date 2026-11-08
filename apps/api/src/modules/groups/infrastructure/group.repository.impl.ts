import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserOrmEntity } from '../../auth/infrastructure/user.orm-entity';
import {
  Group,
  GroupInvitation,
  GroupMember,
  GroupMemberRole,
  InvitationStatus,
} from '../domain/group.entity';
import { GroupRepository } from '../domain/group.repository';
import { GroupInvitationOrmEntity } from './group-invitation.orm-entity';
import { GroupMemberOrmEntity } from './group-member.orm-entity';
import { GroupOrmEntity } from './group.orm-entity';

@Injectable()
export class GroupRepositoryImpl extends GroupRepository {
  constructor(
    @InjectRepository(GroupOrmEntity)
    private readonly groups: Repository<GroupOrmEntity>,
    @InjectRepository(GroupMemberOrmEntity)
    private readonly members: Repository<GroupMemberOrmEntity>,
    @InjectRepository(GroupInvitationOrmEntity)
    private readonly invitations: Repository<GroupInvitationOrmEntity>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async createGroup(input: {
    id: string;
    name: string;
    inviteCode: string;
    createdBy: string;
    memberId: string;
  }): Promise<Group> {
    return this.dataSource.transaction(async (manager) => {
      const groupRepo = manager.getRepository(GroupOrmEntity);
      const memberRepo = manager.getRepository(GroupMemberOrmEntity);

      await groupRepo.save(
        groupRepo.create({
          id: input.id,
          name: input.name,
          inviteCode: input.inviteCode,
          createdBy: input.createdBy,
        }),
      );
      await memberRepo.save(
        memberRepo.create({
          id: input.memberId,
          groupId: input.id,
          userId: input.createdBy,
          role: 'owner',
        }),
      );

      return new Group(
        input.id,
        input.name,
        input.inviteCode,
        input.createdBy,
        'owner',
        1,
      );
    });
  }

  async countActiveMembers(groupId: string): Promise<number> {
    return this.members
      .createQueryBuilder('m')
      .where('m.group_id = :groupId', { groupId })
      .andWhere('m.deleted_at IS NULL')
      .getCount();
  }

  async findById(id: string) {
    const row = await this.groups.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      inviteCode: row.inviteCode,
      createdBy: row.createdBy,
      deletedAt: row.deletedAt,
    };
  }

  async findActiveByInviteCode(inviteCode: string) {
    const row = await this.groups
      .createQueryBuilder('g')
      .where('UPPER(g.invite_code) = :code', {
        code: inviteCode.trim().toUpperCase(),
      })
      .andWhere('g.deleted_at IS NULL')
      .getOne();
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      inviteCode: row.inviteCode,
      createdBy: row.createdBy,
    };
  }

  async findMembership(groupId: string, userId: string) {
    const row = await this.members
      .createQueryBuilder('m')
      .where('m.group_id = :groupId', { groupId })
      .andWhere('m.user_id = :userId', { userId })
      .andWhere('m.deleted_at IS NULL')
      .getOne();
    if (!row) return null;
    return { role: row.role as GroupMemberRole };
  }

  async addMember(input: {
    id: string;
    groupId: string;
    userId: string;
    role: GroupMemberRole;
  }): Promise<void> {
    await this.members.save(
      this.members.create({
        id: input.id,
        groupId: input.groupId,
        userId: input.userId,
        role: input.role,
      }),
    );
  }

  async listForUser(userId: string): Promise<Group[]> {
    const rows = await this.groups
      .createQueryBuilder('g')
      .innerJoin(
        GroupMemberOrmEntity,
        'm',
        'm.group_id = g.id AND m.deleted_at IS NULL',
      )
      .where('m.user_id = :userId', { userId })
      .andWhere('g.deleted_at IS NULL')
      .select([
        'g.id AS id',
        'g.name AS name',
        'g.invite_code AS "inviteCode"',
        'g.created_by AS "createdBy"',
        'm.role AS role',
      ])
      .addSelect((sub) => {
        return sub
          .select('COUNT(1)')
          .from(GroupMemberOrmEntity, 'mc')
          .where('mc.group_id = g.id')
          .andWhere('mc.deleted_at IS NULL');
      }, 'memberCount')
      .getRawMany<{
        id: string;
        name: string;
        inviteCode: string;
        createdBy: string;
        role: GroupMemberRole;
        memberCount: string;
      }>();

    return rows.map(
      (r) =>
        new Group(
          r.id,
          r.name,
          r.inviteCode,
          r.createdBy,
          r.role,
          Number(r.memberCount) || 1,
        ),
    );
  }

  async createInvitation(input: {
    id: string;
    groupId: string;
    invitedBy: string;
    email: string | null;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<GroupInvitation> {
    const row = await this.invitations.save(
      this.invitations.create({
        id: input.id,
        groupId: input.groupId,
        invitedBy: input.invitedBy,
        email: input.email,
        tokenHash: input.tokenHash,
        status: 'pending',
        expiresAt: input.expiresAt,
      }),
    );
    return new GroupInvitation(
      row.id,
      row.groupId,
      row.email,
      'pending',
      row.expiresAt,
      row.createdAt,
    );
  }

  async listInvitations(groupId: string): Promise<GroupInvitation[]> {
    const rows = await this.invitations.find({
      where: { groupId },
      order: { createdAt: 'DESC' },
    });
    const now = new Date();
    return rows.map((row) => {
      let status = row.status as InvitationStatus;
      if (status === 'pending' && row.expiresAt < now) {
        status = 'expired';
      }
      return new GroupInvitation(
        row.id,
        row.groupId,
        row.email,
        status,
        row.expiresAt,
        row.createdAt,
      );
    });
  }

  async findInvitation(groupId: string, invitationId: string) {
    const row = await this.invitations.findOne({
      where: { id: invitationId, groupId },
    });
    if (!row) return null;
    return {
      id: row.id,
      groupId: row.groupId,
      email: row.email,
      status: row.status as InvitationStatus,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
    };
  }

  async updateInvitationStatus(
    invitationId: string,
    status: InvitationStatus,
  ): Promise<void> {
    await this.invitations.update({ id: invitationId }, { status });
  }

  async findInvitationByTokenHash(tokenHash: string) {
    const row = await this.invitations.findOne({ where: { tokenHash } });
    if (!row) return null;
    return {
      id: row.id,
      groupId: row.groupId,
      email: row.email,
      status: row.status as InvitationStatus,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
    };
  }

  async listMembers(groupId: string): Promise<GroupMember[]> {
    const rows = await this.members
      .createQueryBuilder('m')
      .innerJoin(UserOrmEntity, 'u', 'u.id = m.user_id')
      .where('m.group_id = :groupId', { groupId })
      .andWhere('m.deleted_at IS NULL')
      .select([
        'm.user_id AS "userId"',
        'u.full_name AS "fullName"',
        'm.role AS role',
      ])
      .orderBy('m.role', 'ASC')
      .addOrderBy('u.full_name', 'ASC')
      .getRawMany<{ userId: string; fullName: string; role: GroupMemberRole }>();

    return rows.map((r) => new GroupMember(r.userId, r.fullName, r.role));
  }

  async softRemoveMember(groupId: string, userId: string): Promise<void> {
    await this.members.softDelete({ groupId, userId });
  }

  async countOwners(groupId: string): Promise<number> {
    return this.members
      .createQueryBuilder('m')
      .where('m.group_id = :groupId', { groupId })
      .andWhere('m.deleted_at IS NULL')
      .andWhere('m.role = :role', { role: 'owner' })
      .getCount();
  }
}
