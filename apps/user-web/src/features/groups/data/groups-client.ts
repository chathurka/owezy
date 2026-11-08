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
