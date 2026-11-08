export type GroupMemberRole = 'owner' | 'member';

export class Group {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly inviteCode: string,
    public readonly createdBy: string,
    public readonly role: GroupMemberRole,
    public readonly memberCount: number = 1,
  ) {}
}

export class GroupOverview {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly inviteCode: string,
    public readonly role: GroupMemberRole,
    public readonly memberCount: number,
    public readonly activityEmpty: boolean,
  ) {}
}

export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export class GroupInvitation {
  constructor(
    public readonly id: string,
    public readonly groupId: string,
    public readonly email: string | null,
    public readonly status: InvitationStatus,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly token?: string,
  ) {}
}

export class GroupMember {
  constructor(
    public readonly userId: string,
    public readonly fullName: string,
    public readonly role: GroupMemberRole,
  ) {}
}
