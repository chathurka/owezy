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

  const res = await fetch(`${API_URL}/v1/auth/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await res.json().catch(() => ({
    error: { code: 'UPSTREAM_ERROR', message: 'Password reset failed' },
  }));

  if (!res.ok) {
    return NextResponse.json(payload, { status: res.status });
  }

  return NextResponse.json({ data: payload.data ?? payload }, { status: 200 });
}
