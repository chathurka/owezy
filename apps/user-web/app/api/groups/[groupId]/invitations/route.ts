import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function authorized(
  path: string,
  init?: RequestInit,
) {
  const jar = await cookies();
  const accessToken = jar.get('owezy_access_token')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
      { status: 401 },
    );
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers ?? {}),
    },
  });
  const payload = await res.json().catch(() => ({
    error: { code: 'UPSTREAM_ERROR', message: 'Groups request failed' },
  }));
  return NextResponse.json(payload, { status: res.status });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await context.params;
  return authorized(`/v1/groups/${groupId}/invitations`);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 },
    );
  }
  return authorized(`/v1/groups/${groupId}/invitations`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
