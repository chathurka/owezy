import type { MessageKey } from '@/core/i18n/messages/en';

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginFieldErrors = Partial<
  Record<'email' | 'password' | 'form', MessageKey>
>;

export type LoginUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  defaultCurrency: string;
  phone?: string | null;
  paymentHandle?: string | null;
  avatarUrl?: string | null;
  profileSetupCompletedAt?: string | null;
};

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: LoginUser;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginInput(input: LoginInput): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  const email = input.email.trim();
  if (!EMAIL_RE.test(email)) {
    errors.email = 'auth.login.error.email';
  }
  if (input.password.length < 8) {
    errors.password = 'auth.login.error.password';
  }
  return errors;
}
