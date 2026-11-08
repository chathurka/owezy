/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';

const push = jest.fn();
const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

jest.mock('../data/login-client', () => ({
  loginViaBff: jest.fn(),
}));

import { loginViaBff } from '../data/login-client';

const mockedLogin = loginViaBff as jest.MockedFunction<typeof loginViaBff>;

describe('Admin LoginForm', () => {
  beforeEach(() => {
    mockedLogin.mockReset();
    push.mockReset();
    replace.mockReset();
  });

  it('shows validation errors without calling API', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('redirects to MFA when challenge required', async () => {
    mockedLogin.mockResolvedValue({
      mfaRequired: true,
      mfaToken: 'mfa.jwt',
    });
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/you@owezy.com/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/your password/i), {
      target: { value: 'AdminPass1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/login/mfa'));
  });

  it('shows session expired banner', () => {
    render(<LoginForm sessionExpired />);
    expect(screen.getByText(/session has expired/i)).toBeInTheDocument();
  });
});
