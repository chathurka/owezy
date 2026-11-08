/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RegisterForm } from './register-form';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

jest.mock('../data/register-client', () => ({
  registerViaBff: jest.fn(),
}));

jest.mock('../data/apple-client', () => ({
  requestAppleIdentityToken: jest.fn(),
  appleSignInViaBff: jest.fn(),
}));

jest.mock('../data/google-client', () => ({
  requestGoogleIdToken: jest.fn(),
  googleSignInViaBff: jest.fn(),
}));

import { registerViaBff } from '../data/register-client';

const mockedRegister = registerViaBff as jest.MockedFunction<typeof registerViaBff>;

describe('RegisterForm', () => {
  beforeEach(() => {
    mockedRegister.mockReset();
  });

  it('shows field errors without calling the API', async () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/tell us your name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/please accept the terms/i)).toBeInTheDocument();
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it('shows check-inbox UI after successful submit', async () => {
    mockedRegister.mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
      emailVerificationRequired: true,
      user: {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'alex@example.com',
        fullName: 'Alex Morgan',
        role: 'user',
        emailVerified: false,
        defaultCurrency: 'USD',
      },
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText(/alex morgan/i), {
      target: { value: 'Alex Morgan' },
    });
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'alex@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/at least 8 characters/i), {
      target: { value: 'Lisbon2026' },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalled();
    });

    expect(await screen.findByText(/check your inbox/i)).toBeInTheDocument();
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();
  });
});
