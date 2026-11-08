/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ResetPasswordForm } from './reset-password-form';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => ({
    get: (key: string) => (key === 'token' ? 'valid-hex-token' : null),
  }),
}));

jest.mock('../data/password-reset-client', () => ({
  resetPasswordViaBff: jest.fn(),
}));

import { resetPasswordViaBff } from '../data/password-reset-client';

const mockedReset = resetPasswordViaBff as jest.MockedFunction<
  typeof resetPasswordViaBff
>;

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    mockedReset.mockReset();
    replace.mockReset();
  });

  it('shows password validation error without calling the API', async () => {
    render(<ResetPasswordForm />);

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    // The error span (not the hint paragraph) should appear
    expect(
      await screen.findByText('Use 8+ characters with a number and a capital letter'),
    ).toBeInTheDocument();
    expect(mockedReset).not.toHaveBeenCalled();
  });

  it('resets password and shows success state', async () => {
    mockedReset.mockResolvedValue(undefined);

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText(/at least 8 characters/i), {
      target: { value: 'NewPass1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(mockedReset).toHaveBeenCalledWith('valid-hex-token', 'NewPass1');
    });
    expect(
      await screen.findByRole('heading', { name: /password updated/i }),
    ).toBeInTheDocument();
  });

  it('shows invalid token error when API returns RESET_TOKEN_INVALID', async () => {
    const err = new Error('Invalid token') as Error & { code?: string };
    err.code = 'RESET_TOKEN_INVALID';
    mockedReset.mockRejectedValue(err);

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText(/at least 8 characters/i), {
      target: { value: 'NewPass1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(
      await screen.findByText(/invalid, expired, or already used/i),
    ).toBeInTheDocument();
  });

  it('shows generic error for unexpected failures', async () => {
    mockedReset.mockRejectedValue(new Error('network error'));

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText(/at least 8 characters/i), {
      target: { value: 'NewPass1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(
      await screen.findByText(/could not reset your password/i),
    ).toBeInTheDocument();
  });
});
