/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SettingsForm } from './settings-form';

jest.mock('../data/profile-client', () => ({
  getProfileViaBff: jest.fn(),
  updateProfileViaBff: jest.fn(),
}));

import {
  getProfileViaBff,
  updateProfileViaBff,
} from '../data/profile-client';

const mockedGet = getProfileViaBff as jest.MockedFunction<typeof getProfileViaBff>;
const mockedUpdate = updateProfileViaBff as jest.MockedFunction<
  typeof updateProfileViaBff
>;

const profile = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'alex@example.com',
  fullName: 'Alex Morgan',
  role: 'user' as const,
  emailVerified: true,
  defaultCurrency: 'USD',
  preferredLocale: 'en',
  phone: null,
  paymentHandle: null,
  avatarUrl: null,
  profileSetupCompletedAt: '2026-11-08T12:00:00.000Z',
};

describe('SettingsForm', () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedUpdate.mockReset();
    mockedGet.mockResolvedValue(profile);
    mockedUpdate.mockResolvedValue(profile);
  });

  it('loads profile and saves changes', async () => {
    render(<SettingsForm />);

    expect(await screen.findByDisplayValue('Alex Morgan')).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('Alex Morgan'), {
      target: { value: 'Alex M' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: 'Alex M', defaultCurrency: 'USD' }),
      );
    });
    expect(await screen.findByText(/saved/i)).toBeInTheDocument();
  });

  it('blocks empty name', async () => {
    render(<SettingsForm />);
    const field = await screen.findByDisplayValue('Alex Morgan');
    fireEvent.change(field, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(
      await screen.findByText(/tell us your name/i),
    ).toBeInTheDocument();
    expect(mockedUpdate).not.toHaveBeenCalled();
  });
});
