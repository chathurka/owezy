export type Group = {
  id: string;
  name: string;
  inviteCode: string;
  role: 'owner' | 'member';
  memberCount?: number;
};

export type GroupOverview = {
  id: string;
  name: string;
  inviteCode: string;
  role: 'owner' | 'member';
  memberCount: number;
  activityEmpty: boolean;
};

async function parse<T>(response: Response): Promise<T> {
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = json?.error ?? {};
    const error = new Error(err.message ?? 'Groups request failed') as Error & {
      code?: string;
    };
    error.code = err.code ?? 'GROUPS_FAILED';
    throw error;
  }
  return (json.data ?? json) as T;
}

export async function listGroupsViaBff(): Promise<{ items: Group[] }> {
  return parse(await fetch('/api/groups'));
}

export async function createGroupViaBff(input: {
  id: string;
  name: string;
}): Promise<Group> {
  return parse(
    await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  );
}

export async function joinGroupViaBff(inviteCode: string): Promise<Group> {
  return parse(
    await fetch('/api/groups/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode }),
    }),
  );
}

export async function getGroupOverviewViaBff(
  groupId: string,
): Promise<GroupOverview> {
  return parse(await fetch(`/api/groups/${groupId}`));
}

export type GroupInvitation = {
  id: string;
  groupId: string;
  email: string | null;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  expiresAt: string;
  createdAt: string;
  token?: string;
};

export async function createInvitationViaBff(
  groupId: string,
  input: { id: string; email?: string | null },
): Promise<GroupInvitation> {
  return parse(
    await fetch(`/api/groups/${groupId}/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  );
}

export async function listInvitationsViaBff(
  groupId: string,
): Promise<{ items: GroupInvitation[] }> {
  return parse(await fetch(`/api/groups/${groupId}/invitations`));
}

export async function revokeInvitationViaBff(
  groupId: string,
  invitationId: string,
): Promise<GroupInvitation> {
  return parse(
    await fetch(`/api/groups/${groupId}/invitations/${invitationId}/revoke`, {
      method: 'POST',
    }),
  );
}

export async function acceptInvitationViaBff(token: string): Promise<Group> {
  return parse(
    await fetch('/api/invitations/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }),
  );
}

export type GroupMember = {
  userId: string;
  fullName: string;
  role: 'owner' | 'member';
};

export async function listMembersViaBff(
  groupId: string,
): Promise<{ items: GroupMember[] }> {
  return parse(await fetch(`/api/groups/${groupId}/members`));
}

export async function removeMemberViaBff(
  groupId: string,
  userId: string,
): Promise<void> {
  const response = await fetch(`/api/groups/${groupId}/members/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok && response.status !== 204) {
    await parse(response);
  }
}

export async function updateGroupViaBff(
  groupId: string,
  input: { name: string },
): Promise<GroupOverview> {
  return parse(
    await fetch(`/api/groups/${groupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  );
}

export async function archiveGroupViaBff(
  groupId: string,
): Promise<GroupOverview> {
  return parse(
    await fetch(`/api/groups/${groupId}/archive`, {
      method: 'POST',
    }),
  );
}
