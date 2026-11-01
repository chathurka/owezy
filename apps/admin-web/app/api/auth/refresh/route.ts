import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('owezy_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: { code: 'NO_REFRESH_TOKEN' } }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: { code: 'REFRESH_FAILED' } }, { status: 401 });
  }

  const { data } = await res.json();
  const response = NextResponse.json({ ok: true });
  response.cookies.set('owezy_access_token', data.accessToken, { httpOnly: true, path: '/' });
  response.cookies.set('owezy_refresh_token', data.refreshToken, { httpOnly: true, path: '/' });

  return response;
}
