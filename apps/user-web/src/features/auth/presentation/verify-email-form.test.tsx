/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { VerifyEmailForm } from './verify-email-form';

const replace = jest.fn();
const mockSearchParams = { get: jest.fn().mockReturnValue(null) };

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock('../data/verify-email-client', () => ({
  verifyEmailViaBff: jest.fn(),
  resendVerificationViaBff: jest.fn(),
}));

import {
  resendVerificationViaBff,
  verifyEmailViaBff,
} from '../data/verify-email-client';

const mockedVerify = verifyEmailViaBff as jest.MockedFunction<
  typeof verifyEmailViaBff
>;
const mockedResend = resendVerificationViaBff as jest.MockedFunction<
  typeof resendVerificationViaBff
>;

describe('VerifyEmailForm', () => {
  beforeEach(() => {
    mockedVerify.mockReset();
    mockedResend.mockReset();
    replace.mockReset();
    mockSearchParams.get.mockReturnValue(null);
  });

  it('shows code validation error without calling the API', async () => {
    render(<VerifyEmailForm />);

    fireEvent.click(screen.getByRole('button', { name: /verify email/i }));

    expect(
      await screen.findByText(/enter a 6-digit code/i),
    ).toBeInTheDocument();
    expect(mockedVerify).not.toHaveBeenCalled();
  });

  it('calls verify BFF and shows success on valid code', async () => {
    mockedVerify.mockResolvedValue({
      email: 'alex@example.com',
      emailVerified: true,
    });

    render(<VerifyEmailForm />);

    fireEvent.change(screen.getByPlaceholderText('000000'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /verify email/i }));

    await waitFor(() => {
      expect(mockedVerify).toHaveBeenCalledWith('123456');
    });
    expect(
      await screen.findByText(/email verified/i),
    ).toBeInTheDocument();
  });

  it('shows invalid error on VERIFICATION_TOKEN_INVALID', async () => {
    const err = new Error('invalid') as Error & { code?: string };
    err.code = 'VERIFICATION_TOKEN_INVALID';
    mockedVerify.mockRejectedValue(err);

    render(<VerifyEmailForm />);

    fireEvent.change(screen.getByPlaceholderText('000000'), {
      target: { value: '999999' },
    });
    fireEvent.click(screen.getByRole('button', { name: /verify email/i }));

    expect(
      await screen.findByText(/invalid, expired, or already used/i),
    ).toBeInTheDocument();
  });

  it('auto-verifies from ?token= query param', async () => {
    mockSearchParams.get.mockReturnValue('654321');
    mockedVerify.mockResolvedValue({
      email: 'alex@example.com',
      emailVerified: true,
    });

    render(<VerifyEmailForm />);

    await waitFor(() => {
      expect(mockedVerify).toHaveBeenCalledWith('654321');
    });
    expect(await screen.findByText(/email verified/i)).toBeInTheDocument();
  });

  it('calls resend BFF when email prop provided and resend clicked', async () => {
    mockedResend.mockResolvedValue(undefined);

    render(<VerifyEmailForm email="alex@example.com" />);

    fireEvent.click(screen.getByRole('button', { name: /^resend$/i }));

    await waitFor(() => {
      expect(mockedResend).toHaveBeenCalledWith('alex@example.com');
    });
  });
});
