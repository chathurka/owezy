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

  const res = await fetch(`${API_URL}/v1/auth/password/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const payload = await res.json().catch(() => ({
    error: { code: 'UPSTREAM_ERROR', message: 'Forgot password failed' },
  }));

  return NextResponse.json(payload, { status: res.status });
}
