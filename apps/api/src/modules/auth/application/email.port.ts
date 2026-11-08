export interface SendVerificationEmailInput {
  to: string;
  fullName: string;
  /** The plain 6-digit verification code (never log this). */
  verificationToken: string;
}

export interface SendPasswordResetEmailInput {
  to: string;
  fullName: string;
  /** The plain 32-byte hex reset token (never log this). */
  resetToken: string;
}

export abstract class EmailPort {
  abstract sendVerificationEmail(
    input: SendVerificationEmailInput,
  ): Promise<void>;

  abstract sendPasswordResetEmail(
    input: SendPasswordResetEmailInput,
  ): Promise<void>;
}
