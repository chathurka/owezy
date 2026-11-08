export interface SendVerificationEmailInput {
  to: string;
  fullName: string;
  /** The plain 6-digit verification code (never log this). */
  verificationToken: string;
}

export abstract class EmailPort {
  abstract sendVerificationEmail(
    input: SendVerificationEmailInput,
  ): Promise<void>;
}
