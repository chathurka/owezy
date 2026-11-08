export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface PasswordResetFieldErrors {
  email?: string;
  password?: string;
  form?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateForgotPasswordInput(
  input: ForgotPasswordInput,
): PasswordResetFieldErrors {
  const errors: PasswordResetFieldErrors = {};
  if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = 'auth.forgotPassword.error.email';
  }
  return errors;
}

export function validateResetPasswordInput(
  input: ResetPasswordInput,
): PasswordResetFieldErrors {
  const errors: PasswordResetFieldErrors = {};
  if (
    input.password.length < 8 ||
    !/[A-Z]/.test(input.password) ||
    !/[0-9]/.test(input.password)
  ) {
    errors.password = 'auth.resetPassword.error.password';
  }
  return errors;
}
