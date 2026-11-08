import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../../auth/domain/user.repository';
import { Group } from '../domain/group.entity';
import { GroupRepository } from '../domain/group.repository';
import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  let groups: jest.Mocked<GroupRepository>;
  let users: jest.Mocked<UserRepository>;
  let service: GroupsService;

  beforeEach(() => {
    groups = {
      createGroup: jest.fn(),
      findById: jest.fn(),
      findActiveByInviteCode: jest.fn(),
      findMembership: jest.fn(),
      addMember: jest.fn(),
      listForUser: jest.fn(),
    } as unknown as jest.Mocked<GroupRepository>;
    users = {
      updateProfile: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<UserRepository>;
    service = new GroupsService(groups, users);
  });

  it('creates a group and completes onboarding', async () => {
    groups.findById.mockResolvedValue(null);
    groups.createGroup.mockResolvedValue(
      new Group('g1', 'Trip', 'ABCD1234', 'u1', 'owner'),
    );

    const result = await service.create('u1', {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Trip',
    });

    expect(result.name).toBe('Trip');
    expect(users.updateProfile).toHaveBeenCalledWith('u1', {
      completeGroupOnboarding: true,
    });
  });

  it('returns existing group for same client id', async () => {
    groups.findById.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Trip',
      inviteCode: 'ABCD1234',
      createdBy: 'u1',
      deletedAt: null,
    });
    groups.findMembership.mockResolvedValue({ role: 'owner' });

    const result = await service.create('u1', {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Trip Again',
    });

    expect(result.name).toBe('Trip');
    expect(groups.createGroup).not.toHaveBeenCalled();
  });

  it('rejects id owned by another user', async () => {
    groups.findById.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Trip',
      inviteCode: 'ABCD1234',
      createdBy: 'other',
      deletedAt: null,
    });

    await expect(
      service.create('u1', {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Trip',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects empty name', async () => {
    await expect(
      service.create('u1', {
        id: '11111111-1111-4111-8111-111111111111',
        name: '  ',
      }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('joins by invite code', async () => {
    groups.findActiveByInviteCode.mockResolvedValue({
      id: 'g1',
      name: 'Trip',
      inviteCode: 'ABCD1234',
      createdBy: 'owner',
    });
    groups.findMembership.mockResolvedValue(null);
    groups.addMember.mockResolvedValue(undefined);

    const result = await service.join('u2', { inviteCode: 'abcd1234' });
    expect(result.role).toBe('member');
    expect(groups.addMember).toHaveBeenCalled();
  });

  it('throws when invite invalid', async () => {
    groups.findActiveByInviteCode.mockResolvedValue(null);
    await expect(
      service.join('u2', { inviteCode: 'NOPE' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
