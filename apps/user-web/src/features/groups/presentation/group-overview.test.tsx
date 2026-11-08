/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import { GroupOverview } from './group-overview';

jest.mock('../data/groups-client', () => ({
  getGroupOverviewViaBff: jest.fn(),
}));

import { getGroupOverviewViaBff } from '../data/groups-client';

const mockedOverview = getGroupOverviewViaBff as jest.MockedFunction<
  typeof getGroupOverviewViaBff
>;

describe('GroupOverview', () => {
  it('shows empty activity state', async () => {
    mockedOverview.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Trip',
      inviteCode: 'ABCD1234',
      role: 'owner',
      memberCount: 1,
      activityEmpty: true,
    });

    render(<GroupOverview groupId="11111111-1111-4111-8111-111111111111" />);

    await waitFor(() => {
      expect(screen.getByText(/no activity yet/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Trip')).toBeInTheDocument();
  });
});
