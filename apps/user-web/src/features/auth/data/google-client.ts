export type GoogleSignInPayload = {
  idToken: string;
  fullName?: string;
  email?: string;
};

export type GoogleSignInResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    emailVerified: boolean;
    defaultCurrency: string;
  };
};

export async function googleSignInViaBff(
  payload: GoogleSignInPayload,
): Promise<GoogleSignInResult> {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const code =
      body?.error?.code ??
      body?.code ??
      (res.status === 401 ? 'INVALID_GOOGLE_TOKEN' : 'GOOGLE_SIGN_IN_FAILED');
    const error = new Error(
      body?.error?.message ?? 'Google sign in failed',
    ) as Error & { code?: string };
    error.code = code;
    throw error;
  }

  return (body.data ?? body) as GoogleSignInResult;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (
            momentListener?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
              isDismissedMoment: () => boolean;
              getDismissedReason: () => string;
            }) => void,
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

function loadGoogleSdk(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Sign In requires a browser'));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-owezy-google-sdk="true"]',
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Google SDK')),
      );
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.dataset.owezyGoogleSdk = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google SDK'));
    document.head.appendChild(script);
  });
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function requestGoogleIdToken(): Promise<GoogleSignInPayload> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    const error = new Error('Google Sign In is not configured') as Error & {
      code?: string;
    };
    error.code = 'GOOGLE_NOT_CONFIGURED';
    throw error;
  }

  await loadGoogleSdk();
  if (!window.google?.accounts?.id) {
    const error = new Error('Google SDK unavailable') as Error & {
      code?: string;
    };
    error.code = 'GOOGLE_SDK_UNAVAILABLE';
    throw error;
  }

  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = (payload: GoogleSignInPayload) => {
      if (settled) return;
      settled = true;
      resolve(payload);
    };

    const fail = (code: string, message: string) => {
      if (settled) return;
      settled = true;
      const error = new Error(message) as Error & { code?: string };
      error.code = code;
      reject(error);
    };

    window.google!.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        const idToken = response.credential;
        if (!idToken) {
          fail('GOOGLE_SIGN_IN_FAILED', 'Google did not return an ID token');
          return;
        }

        const claims = decodeJwtPayload(idToken);
        const email =
          typeof claims?.email === 'string' ? claims.email : undefined;
        const fullName =
          typeof claims?.name === 'string' ? claims.name : undefined;

        finish({
          idToken,
          email,
          fullName,
        });
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google!.accounts.id.prompt((notification) => {
      if (
        notification.isNotDisplayed() ||
        notification.isSkippedMoment() ||
        (notification.isDismissedMoment() &&
          notification.getDismissedReason() === 'credential_returned')
      ) {
        // credential_returned is success path via callback; other dismissals cancel.
        if (
          notification.isDismissedMoment() &&
          notification.getDismissedReason() === 'credential_returned'
        ) {
          return;
        }
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          fail('GOOGLE_SIGN_IN_CANCELLED', 'Google Sign In was cancelled');
        }
      } else if (
        notification.isDismissedMoment() &&
        notification.getDismissedReason() !== 'credential_returned'
      ) {
        fail('GOOGLE_SIGN_IN_CANCELLED', 'Google Sign In was cancelled');
      }
    });
  });
}
