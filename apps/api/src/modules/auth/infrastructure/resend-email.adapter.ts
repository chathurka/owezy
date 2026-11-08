import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EmailPort,
  SendPasswordResetEmailInput,
  SendVerificationEmailInput,
} from '../application/email.port';

@Injectable()
export class ResendEmailAdapter extends EmailPort {
  private readonly logger = new Logger(ResendEmailAdapter.name);

  constructor(private readonly config: ConfigService) {
    super();
  }

  async sendVerificationEmail(input: SendVerificationEmailInput): Promise<void> {
    const apiKey = this.config.get<string>('email.resendApiKey');
    const from = this.config.get<string>('email.from');
    const userWebUrl = this.config.get<string>('userWebUrl');
    const verifyUrl = `${userWebUrl}/verify-email?token=${encodeURIComponent(input.verificationToken)}`;

    const subject = 'Confirm your Owezy email';
    const text = [
      `Hi ${input.fullName},`,
      '',
      'Welcome to Owezy! Your verification code is:',
      '',
      `    ${input.verificationToken}`,
      '',
      'Enter this 6-digit code in the app to confirm your email address.',
      '',
      'Or click the link below to verify automatically:',
      verifyUrl,
      '',
      'This code expires in 15 minutes.',
      '',
      'If you did not create an account, you can ignore this message.',
    ].join('\n');

    if (!apiKey || apiKey.startsWith('re_test') || apiKey === 'changeme') {
      this.logger.warn('Verification email skipped (Resend not configured)');
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject,
        text,
      }),
    });

    if (!response.ok) {
      this.logger.error(`Verification email send failed status=${response.status}`);
      return;
    }
  }

  async sendPasswordResetEmail(
    input: SendPasswordResetEmailInput,
  ): Promise<void> {
    const apiKey = this.config.get<string>('email.resendApiKey');
    const from = this.config.get<string>('email.from');
    const userWebUrl = this.config.get<string>('userWebUrl');
    const resetUrl = `${userWebUrl}/reset-password?token=${encodeURIComponent(input.resetToken)}`;

    const subject = 'Reset your Owezy password';
    const text = [
      `Hi ${input.fullName},`,
      '',
      'We received a request to reset your Owezy password.',
      '',
      'Click the link below to choose a new password:',
      resetUrl,
      '',
      'This link expires in 30 minutes.',
      '',
      'If you did not request a password reset, you can safely ignore this email.',
    ].join('\n');

    if (!apiKey || apiKey.startsWith('re_test') || apiKey === 'changeme') {
      this.logger.warn('Password reset email skipped (Resend not configured)');
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject,
        text,
      }),
    });

    if (!response.ok) {
      this.logger.error(
        `Password reset email send failed status=${response.status}`,
      );
      return;
    }
  }
}
