/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GroupOnboardingForm } from './group-onboarding-form';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

jest.mock('../data/groups-client', () => ({
  createGroupViaBff: jest.fn(),
  joinGroupViaBff: jest.fn(),
}));

jest.mock('@/features/profile/data/profile-client', () => ({
  updateProfileViaBff: jest.fn(),
}));

import { createGroupViaBff } from '../data/groups-client';
import { updateProfileViaBff } from '@/features/profile/data/profile-client';

const mockedCreate = createGroupViaBff as jest.MockedFunction<
  typeof createGroupViaBff
>;
const mockedUpdate = updateProfileViaBff as jest.MockedFunction<
  typeof updateProfileViaBff
>;

describe('GroupOnboardingForm', () => {
  beforeEach(() => {
    mockedCreate.mockReset();
    mockedUpdate.mockReset();
    replace.mockReset();
  });

  it('skips onboarding and redirects home', async () => {
    mockedUpdate.mockResolvedValue({
      id: '1',
      email: 'a@b.com',
      fullName: 'A',
      role: 'user',
      emailVerified: true,
      defaultCurrency: 'USD',
      preferredLocale: 'en',
      phone: null,
      paymentHandle: null,
      avatarUrl: null,
      profileSetupCompletedAt: '2026-11-08T12:00:00.000Z',
      groupOnboardingCompletedAt: '2026-11-08T12:00:00.000Z',
    });

    render(<GroupOnboardingForm />);
    fireEvent.click(screen.getByRole('button', { name: /skip for now/i }));

    await waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledWith({
        completeGroupOnboarding: true,
      });
    });
    expect(replace).toHaveBeenCalledWith('/');
  });
});
