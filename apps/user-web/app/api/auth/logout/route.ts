import { NextRequest } from 'next/server';
import { redirectTo } from '@/core/http/redirect';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('owezy_refresh_token')?.value;

  await fetch(`${API_URL}/v1/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...(refreshToken ? { refreshToken } : {}) }),
  }).catch(() => null);

  const response = redirectTo('/login');
  response.cookies.delete('owezy_access_token');
  response.cookies.delete('owezy_refresh_token');

  return response;
}
