import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function POST(
  _request: Request,
  context: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await context.params;
  const jar = await cookies();
  const accessToken = jar.get('owezy_access_token')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
      { status: 401 },
    );
  }
  const res = await fetch(`${API_URL}/v1/groups/${groupId}/archive`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await res.json().catch(() => ({
    error: { code: 'UPSTREAM_ERROR', message: 'Archive request failed' },
  }));
  return NextResponse.json(payload, { status: res.status });
}
