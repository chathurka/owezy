export type GroupMemberRole = 'owner' | 'member';

export class Group {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly inviteCode: string,
    public readonly createdBy: string,
    public readonly role: GroupMemberRole,
  ) {}
}
