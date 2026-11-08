import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Group, GroupMemberRole } from '../domain/group.entity';
import { GroupRepository } from '../domain/group.repository';
import { GroupMemberOrmEntity } from './group-member.orm-entity';
import { GroupOrmEntity } from './group.orm-entity';

@Injectable()
export class GroupRepositoryImpl extends GroupRepository {
  constructor(
    @InjectRepository(GroupOrmEntity)
    private readonly groups: Repository<GroupOrmEntity>,
    @InjectRepository(GroupMemberOrmEntity)
    private readonly members: Repository<GroupMemberOrmEntity>,
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
      );
    });
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
      .getRawMany<{
        id: string;
        name: string;
        inviteCode: string;
        createdBy: string;
        role: GroupMemberRole;
      }>();

    return rows.map(
      (r) => new Group(r.id, r.name, r.inviteCode, r.createdBy, r.role),
    );
  }
}
