export async function forgotPasswordViaBff(email: string): Promise<void> {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (response.status === 204) return;

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = json?.error ?? {};
    const error = new Error(err.message ?? 'Forgot password failed') as Error & {
      code?: string;
      status?: number;
    };
    error.code = err.code ?? 'FORGOT_PASSWORD_FAILED';
    error.status = response.status;
    throw error;
  }
}

export async function resetPasswordViaBff(
  token: string,
  password: string,
): Promise<void> {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = json?.error ?? {};
    const error = new Error(err.message ?? 'Password reset failed') as Error & {
      code?: string;
      status?: number;
    };
    error.code = err.code ?? 'RESET_PASSWORD_FAILED';
    error.status = response.status;
    throw error;
  }
}
