/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ForgotPasswordForm } from './forgot-password-form';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock('../data/password-reset-client', () => ({
  forgotPasswordViaBff: jest.fn(),
}));

import { forgotPasswordViaBff } from '../data/password-reset-client';

const mockedForgot = forgotPasswordViaBff as jest.MockedFunction<
  typeof forgotPasswordViaBff
>;

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    mockedForgot.mockReset();
  });

  it('shows email validation error without calling the API', async () => {
    render(<ForgotPasswordForm />);

    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(
      await screen.findByText(/enter a valid email/i),
    ).toBeInTheDocument();
    expect(mockedForgot).not.toHaveBeenCalled();
  });

  it('shows success state after successful submission', async () => {
    mockedForgot.mockResolvedValue(undefined);

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'alex@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockedForgot).toHaveBeenCalledWith('alex@example.com');
    });
    expect(
      await screen.findByRole('heading', { name: /check your inbox/i }),
    ).toBeInTheDocument();
  });

  it('shows success state even when BFF throws (non-enumerating)', async () => {
    const err = new Error('failed') as Error & { code?: string };
    err.code = 'UPSTREAM_ERROR';
    mockedForgot.mockRejectedValue(err);

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'alex@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(
      await screen.findByRole('heading', { name: /check your inbox/i }),
    ).toBeInTheDocument();
  });
});
