import type { RegisterInput, RegisterResult } from '../domain/register';

export async function registerViaBff(input: RegisterInput): Promise<RegisterResult> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = json?.error ?? {};
    const error = new Error(err.message ?? 'Registration failed') as Error & {
      code?: string;
      status?: number;
      details?: unknown;
    };
    error.code = err.code ?? 'REGISTER_FAILED';
    error.status = response.status;
    error.details = err.details;
    throw error;
  }

  return (json.data ?? json) as RegisterResult;
}
