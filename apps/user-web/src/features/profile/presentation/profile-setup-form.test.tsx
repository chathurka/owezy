/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProfileSetupForm } from './profile-setup-form';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

jest.mock('../data/profile-client', () => ({
  updateProfileViaBff: jest.fn(),
}));

import { updateProfileViaBff } from '../data/profile-client';

const mockedUpdate = updateProfileViaBff as jest.MockedFunction<
  typeof updateProfileViaBff
>;

describe('ProfileSetupForm', () => {
  beforeEach(() => {
    mockedUpdate.mockReset();
    replace.mockReset();
  });

  it('blocks submit when full name is empty', async () => {
    render(<ProfileSetupForm />);

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      await screen.findByText(/tell us your name/i),
    ).toBeInTheDocument();
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('submits valid form and redirects home', async () => {
    mockedUpdate.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      email: 'alex@example.com',
      fullName: 'Alex Morgan',
      role: 'user',
      emailVerified: true,
      defaultCurrency: 'USD',
      phone: null,
      paymentHandle: null,
      avatarUrl: null,
      profileSetupCompletedAt: '2026-11-08T12:00:00.000Z',
    });

    render(<ProfileSetupForm initialFullName="Alex" />);

    fireEvent.change(screen.getByPlaceholderText(/alex morgan/i), {
      target: { value: 'Alex Morgan' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledWith({
        fullName: 'Alex Morgan',
        phone: undefined,
        paymentHandle: undefined,
        completeSetup: true,
      });
    });
    expect(replace).toHaveBeenCalledWith('/');
  });
});
