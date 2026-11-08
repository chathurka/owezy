import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function authorizedFetch(path: string, init?: RequestInit) {
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
    error: { code: 'UPSTREAM_ERROR', message: 'Profile request failed' },
  }));

  return NextResponse.json(payload, { status: res.status });
}

export async function GET() {
  return authorizedFetch('/v1/users/me');
}

export async function PATCH(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 },
    );
  }
  return authorizedFetch('/v1/users/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
