/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

jest.mock('../data/login-client', () => ({
  loginViaBff: jest.fn(),
}));

jest.mock('../data/apple-client', () => ({
  requestAppleIdentityToken: jest.fn(),
  appleSignInViaBff: jest.fn(),
}));

import { loginViaBff } from '../data/login-client';
import {
  appleSignInViaBff,
  requestAppleIdentityToken,
} from '../data/apple-client';

const mockedLogin = loginViaBff as jest.MockedFunction<typeof loginViaBff>;
const mockedAppleRequest = requestAppleIdentityToken as jest.MockedFunction<
  typeof requestAppleIdentityToken
>;
const mockedAppleBff = appleSignInViaBff as jest.MockedFunction<
  typeof appleSignInViaBff
>;

describe('LoginForm', () => {
  beforeEach(() => {
    mockedLogin.mockReset();
    mockedAppleRequest.mockReset();
    mockedAppleBff.mockReset();
    replace.mockReset();
  });

  it('shows field errors without calling the API', async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(
      screen.getByText(/password must be at least 8 characters/i),
    ).toBeInTheDocument();
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('calls BFF helper and redirects after successful submit', async () => {
    mockedLogin.mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
      user: {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'alex@example.com',
        fullName: 'Alex Morgan',
        role: 'user',
        emailVerified: true,
        defaultCurrency: 'USD',
      },
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'alex@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/at least 8 characters/i), {
      target: { value: 'Lisbon2026' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        email: 'alex@example.com',
        password: 'Lisbon2026',
      });
    });
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('shows session expired banner when flagged', () => {
    render(<LoginForm sessionExpired />);
    expect(
      screen.getByText(/your session has expired/i),
    ).toBeInTheDocument();
  });

  it('continues with Apple and redirects after success', async () => {
    mockedAppleRequest.mockResolvedValue({
      identityToken: 'apple.jwt',
      fullName: 'Alex Morgan',
    });
    mockedAppleBff.mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
      user: {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'alex@example.com',
        fullName: 'Alex Morgan',
        role: 'user',
        emailVerified: true,
        defaultCurrency: 'USD',
      },
    });

    render(<LoginForm />);
    fireEvent.click(
      screen.getByRole('button', { name: /continue with apple/i }),
    );

    await waitFor(() => {
      expect(mockedAppleBff).toHaveBeenCalledWith({
        identityToken: 'apple.jwt',
        fullName: 'Alex Morgan',
      });
    });
    expect(replace).toHaveBeenCalledWith('/');
  });
});
