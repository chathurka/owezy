import { Group, GroupMemberRole } from './group.entity';

export abstract class GroupRepository {
  abstract createGroup(input: {
    id: string;
    name: string;
    inviteCode: string;
    createdBy: string;
    memberId: string;
  }): Promise<Group>;

  abstract findById(id: string): Promise<{
    id: string;
    name: string;
    inviteCode: string;
    createdBy: string;
    deletedAt: Date | null;
  } | null>;

  abstract findActiveByInviteCode(inviteCode: string): Promise<{
    id: string;
    name: string;
    inviteCode: string;
    createdBy: string;
  } | null>;

  abstract findMembership(
    groupId: string,
    userId: string,
  ): Promise<{ role: GroupMemberRole } | null>;

  abstract addMember(input: {
    id: string;
    groupId: string;
    userId: string;
    role: GroupMemberRole;
  }): Promise<void>;

  abstract listForUser(userId: string): Promise<Group[]>;
}
