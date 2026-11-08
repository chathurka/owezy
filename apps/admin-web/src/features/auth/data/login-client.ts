export type AdminLoginResult =
  | {
      mfaRequired: true;
      mfaToken: string;
    }
  | {
      mfaRequired?: false;
      accessToken: string;
      refreshToken: string;
      user: { role: string; email: string; fullName: string; id: string };
    };

export async function loginViaBff(input: {
  email: string;
  password: string;
}): Promise<AdminLoginResult> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(body?.error?.message ?? 'Login failed') as Error & {
      code?: string;
    };
    error.code = body?.error?.code ?? 'LOGIN_FAILED';
    throw error;
  }
  return (body.data ?? body) as AdminLoginResult;
}

export async function verifyMfaViaBff(input: {
  mfaToken: string;
  code: string;
}): Promise<AdminLoginResult> {
  const res = await fetch('/api/auth/mfa-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(body?.error?.message ?? 'MFA failed') as Error & {
      code?: string;
    };
    error.code = body?.error?.code ?? 'MFA_FAILED';
    throw error;
  }
  return (body.data ?? body) as AdminLoginResult;
}
