import {
  Group,
  GroupInvitation,
  GroupMember,
  GroupMemberRole,
  InvitationStatus,
} from './group.entity';

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
    archivedAt: Date | null;
  } | null>;

  abstract updateGroupName(id: string, name: string): Promise<void>;

  abstract archiveGroup(id: string, archivedAt: Date): Promise<void>;

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

  abstract countActiveMembers(groupId: string): Promise<number>;

  abstract createInvitation(input: {
    id: string;
    groupId: string;
    invitedBy: string;
    email: string | null;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<GroupInvitation>;

  abstract listInvitations(groupId: string): Promise<GroupInvitation[]>;

  abstract findInvitation(
    groupId: string,
    invitationId: string,
  ): Promise<{
    id: string;
    groupId: string;
    email: string | null;
    status: InvitationStatus;
    expiresAt: Date;
    createdAt: Date;
  } | null>;

  abstract updateInvitationStatus(
    invitationId: string,
    status: InvitationStatus,
  ): Promise<void>;

  abstract findInvitationByTokenHash(tokenHash: string): Promise<{
    id: string;
    groupId: string;
    email: string | null;
    status: InvitationStatus;
    expiresAt: Date;
    createdAt: Date;
  } | null>;

  abstract listMembers(groupId: string): Promise<GroupMember[]>;

  abstract softRemoveMember(groupId: string, userId: string): Promise<void>;

  abstract countOwners(groupId: string): Promise<number>;
}
