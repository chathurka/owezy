import type { UpdateProfileInput, UserProfile } from '../domain/profile';

async function parseProfileResponse(response: Response): Promise<UserProfile> {
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = json?.error ?? {};
    const error = new Error(err.message ?? 'Profile request failed') as Error & {
      code?: string;
      status?: number;
      details?: unknown;
    };
    error.code = err.code ?? 'PROFILE_FAILED';
    error.status = response.status;
    error.details = err.details;
    throw error;
  }
  return (json.data ?? json) as UserProfile;
}

export async function getProfileViaBff(): Promise<UserProfile> {
  const response = await fetch('/api/profile/me', { method: 'GET' });
  return parseProfileResponse(response);
}

export async function updateProfileViaBff(
  input: UpdateProfileInput,
): Promise<UserProfile> {
  const response = await fetch('/api/profile/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseProfileResponse(response);
}
