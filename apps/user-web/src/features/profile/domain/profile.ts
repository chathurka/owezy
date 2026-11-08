import type { MessageKey } from '@/core/i18n/messages/en';

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  defaultCurrency: string;
  preferredLocale: string;
  phone: string | null;
  paymentHandle: string | null;
  avatarUrl: string | null;
  profileSetupCompletedAt: string | null;
};

export type UpdateProfileInput = {
  fullName: string;
  phone?: string;
  paymentHandle?: string;
  defaultCurrency?: string;
  preferredLocale?: string;
  completeSetup?: boolean;
};

export type ProfileSetupFieldErrors = Partial<
  Record<'fullName' | 'form', MessageKey>
>;

export function needsProfileSetup(
  user: { profileSetupCompletedAt?: string | null } | null | undefined,
): boolean {
  return !user?.profileSetupCompletedAt;
}

export function validateProfileSetupInput(
  input: UpdateProfileInput,
): ProfileSetupFieldErrors {
  const errors: ProfileSetupFieldErrors = {};
  if (input.fullName.trim().length === 0) {
    errors.fullName = 'profile.setup.error.fullName';
  }
  return errors;
}

export function postAuthPath(
  user: { profileSetupCompletedAt?: string | null } | null | undefined,
): '/profile/setup' | '/' {
  return needsProfileSetup(user) ? '/profile/setup' : '/';
}
