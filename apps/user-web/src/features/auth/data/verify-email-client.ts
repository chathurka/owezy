export interface VerifyEmailResult {
  email: string;
  emailVerified: true;
}

export async function verifyEmailViaBff(token: string): Promise<VerifyEmailResult> {
  const response = await fetch('/api/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = json?.error ?? json ?? {};
    const error = new Error(err.message ?? 'Verification failed') as Error & {
      code?: string;
      status?: number;
    };
    error.code = err.code ?? 'VERIFY_FAILED';
    error.status = response.status;
    throw error;
  }

  return (json.data ?? json) as VerifyEmailResult;
}

export async function resendVerificationViaBff(email: string): Promise<void> {
  await fetch('/api/auth/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  // Always void — API never reveals whether email exists.
}
