import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
      { status: 400 },
    );
  }

  const res = await fetch(`${API_URL}/v1/auth/mfa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await res.json().catch(() => ({
    error: { code: 'UPSTREAM_ERROR', message: 'MFA verify failed' },
  }));

  if (!res.ok) {
    return NextResponse.json(payload, { status: res.status });
  }

  const data = payload.data ?? payload;
  if (data.user?.role && data.user.role !== 'admin') {
    return NextResponse.json(
      {
        error: {
          code: 'NOT_ADMIN',
          message: 'This account cannot access the admin console',
        },
      },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ data }, { status: 200 });
  if (data.accessToken && data.refreshToken) {
    response.cookies.set('owezy_access_token', data.accessToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    response.cookies.set('owezy_refresh_token', data.refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
  }
  return response;
}
