export interface SendVerificationEmailInput {
  to: string;
  fullName: string;
  verificationToken: string;
}

export abstract class EmailPort {
  abstract sendVerificationEmail(
    input: SendVerificationEmailInput,
  ): Promise<void>;
}
