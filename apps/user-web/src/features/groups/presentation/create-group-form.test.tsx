/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CreateGroupForm } from './create-group-form';

const replace = jest.fn();
const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push }),
}));

jest.mock('../data/groups-client', () => ({
  createGroupViaBff: jest.fn(),
}));

import { createGroupViaBff } from '../data/groups-client';

const mockedCreate = createGroupViaBff as jest.MockedFunction<
  typeof createGroupViaBff
>;

describe('CreateGroupForm', () => {
  beforeEach(() => {
    mockedCreate.mockReset();
    replace.mockReset();
    push.mockReset();
  });

  it('submits a stable client id and navigates to groups list', async () => {
    mockedCreate.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Trip',
      inviteCode: 'ABCD1234',
      role: 'owner',
    });

    render(<CreateGroupForm />);
    fireEvent.change(screen.getByLabelText(/group name/i), {
      target: { value: 'Trip' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create group/i }));

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Trip', id: expect.any(String) }),
      );
    });
    expect(replace).toHaveBeenCalledWith('/groups');
  });
});
