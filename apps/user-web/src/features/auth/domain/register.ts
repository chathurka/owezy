import type { MessageKey } from '@/core/i18n';

export const ALLOWED_CURRENCIES = ['USD', 'EUR', 'GBP', 'LKR', 'INR'] as const;

export type AllowedCurrency = (typeof ALLOWED_CURRENCIES)[number];

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  defaultCurrency: AllowedCurrency;
  acceptedTerms: boolean;
};

export type RegisterUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'user';
  emailVerified: boolean;
  defaultCurrency: AllowedCurrency;
};

export type RegisterResult = {
  accessToken: string;
  refreshToken: string;
  user: RegisterUser;
  emailVerificationRequired: true;
};

export type RegisterFieldErrors = Partial<
  Record<'fullName' | 'email' | 'password' | 'defaultCurrency' | 'acceptedTerms' | 'form', MessageKey>
>;

export function validateRegisterInput(input: RegisterInput): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  if (input.fullName.trim().length < 2) {
    errors.fullName = 'auth.register.error.fullName';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'auth.register.error.email';
  }

  if (
    input.password.length < 8 ||
    !/[A-Z]/.test(input.password) ||
    !/\d/.test(input.password)
  ) {
    errors.password = 'auth.register.error.password';
  }

  if (!ALLOWED_CURRENCIES.includes(input.defaultCurrency)) {
    errors.defaultCurrency = 'auth.register.error.currency';
  }

  if (!input.acceptedTerms) {
    errors.acceptedTerms = 'auth.register.error.terms';
  }

  return errors;
}

export function passwordStrength(password: string): {
  score: number;
  labelKey: MessageKey;
} {
  let score = 0;
  if (password.length >= 8) {
    score = 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
  }

  if (!password.length) {
    return { score, labelKey: 'auth.register.strength.useMin' };
  }
  if (!score) {
    return { score, labelKey: 'auth.register.strength.tooShort' };
  }

  const labels: MessageKey[] = [
    'auth.register.strength.useMin',
    'auth.register.strength.weak',
    'auth.register.strength.fair',
    'auth.register.strength.good',
    'auth.register.strength.strong',
  ];
  return { score, labelKey: labels[score] };
}
