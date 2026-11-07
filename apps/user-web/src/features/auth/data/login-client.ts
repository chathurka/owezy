import type { LoginInput, LoginResult } from '../domain/login';

export async function loginViaBff(input: LoginInput): Promise<LoginResult> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = json?.error ?? {};
    const error = new Error(err.message ?? 'Sign in failed') as Error & {
      code?: string;
      status?: number;
      details?: unknown;
    };
    error.code = err.code ?? 'LOGIN_FAILED';
    error.status = response.status;
    error.details = err.details;
    throw error;
  }

  return (json.data ?? json) as LoginResult;
}
