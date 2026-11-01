import { cookies } from 'next/headers';
import { env } from '@/core/config/env';
import { ApiError } from './api-error';

type FetchOptions = Omit<RequestInit, 'body'> & { body?: unknown };

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const cookieStore = cookies();
  const token = cookieStore.get('owezy_access_token')?.value;

  const { body, headers: extraHeaders, ...rest } = options;

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({
      error: { code: 'UNKNOWN', message: 'Unknown error' },
    }));
    const err = errorBody.error ?? {};
    throw new ApiError(err.code ?? 'UNKNOWN', err.message ?? 'Unknown error', response.status, err.details);
  }

  const json = await response.json();
  return json.data as T;
}

export const apiGet = <T>(path: string, options?: FetchOptions) =>
  apiFetch<T>(path, { ...options, method: 'GET' });

export const apiPost = <T>(path: string, body?: unknown, options?: FetchOptions) =>
  apiFetch<T>(path, { ...options, method: 'POST', body });

export const apiPut = <T>(path: string, body?: unknown, options?: FetchOptions) =>
  apiFetch<T>(path, { ...options, method: 'PUT', body });

export const apiPatch = <T>(path: string, body?: unknown, options?: FetchOptions) =>
  apiFetch<T>(path, { ...options, method: 'PATCH', body });

export const apiDelete = <T>(path: string, options?: FetchOptions) =>
  apiFetch<T>(path, { ...options, method: 'DELETE' });
