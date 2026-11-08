export type AppleSignInPayload = {
  identityToken: string;
  fullName?: string;
  email?: string;
  authorizationCode?: string;
};

export type AppleSignInResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    emailVerified: boolean;
    defaultCurrency: string;
    profileSetupCompletedAt?: string | null;
  };
};

export async function appleSignInViaBff(
  payload: AppleSignInPayload,
): Promise<AppleSignInResult> {
  const res = await fetch('/api/auth/apple', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const code =
      body?.error?.code ??
      body?.code ??
      (res.status === 401 ? 'INVALID_APPLE_TOKEN' : 'APPLE_SIGN_IN_FAILED');
    const error = new Error(body?.error?.message ?? 'Apple sign in failed') as Error & {
      code?: string;
    };
    error.code = code;
    throw error;
  }

  return (body.data ?? body) as AppleSignInResult;
}

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<{
          authorization: { id_token: string; code?: string };
          user?: {
            email?: string;
            name?: { firstName?: string; lastName?: string };
          };
        }>;
      };
    };
  }
}

function loadAppleSdk(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Apple Sign In requires a browser'));
  }
  if (window.AppleID) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-owezy-apple-sdk="true"]',
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Apple SDK')),
      );
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.dataset.owezyAppleSdk = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Apple SDK'));
    document.head.appendChild(script);
  });
}

export async function requestAppleIdentityToken(): Promise<AppleSignInPayload> {
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  const redirectURI =
    process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ??
    (typeof window !== 'undefined' ? `${window.location.origin}/login` : '');

  if (!clientId) {
    const error = new Error('Apple Sign In is not configured') as Error & {
      code?: string;
    };
    error.code = 'APPLE_NOT_CONFIGURED';
    throw error;
  }

  await loadAppleSdk();
  if (!window.AppleID) {
    const error = new Error('Apple SDK unavailable') as Error & { code?: string };
    error.code = 'APPLE_SDK_UNAVAILABLE';
    throw error;
  }

  window.AppleID.auth.init({
    clientId,
    scope: 'name email',
    redirectURI,
    usePopup: true,
  });

  const result = await window.AppleID.auth.signIn();
  const fullName = [result.user?.name?.firstName, result.user?.name?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    identityToken: result.authorization.id_token,
    authorizationCode: result.authorization.code,
    email: result.user?.email,
    fullName: fullName || undefined,
  };
}
