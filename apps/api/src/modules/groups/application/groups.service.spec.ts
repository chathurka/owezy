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
      countActiveMembers: jest.fn().mockResolvedValue(1),
      createInvitation: jest.fn(),
      listInvitations: jest.fn(),
      findInvitation: jest.fn(),
      updateInvitationStatus: jest.fn(),
      findInvitationByTokenHash: jest.fn(),
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

  it('returns overview for members', async () => {
    groups.findMembership.mockResolvedValue({ role: 'owner' });
    groups.findById.mockResolvedValue({
      id: 'g1',
      name: 'Trip',
      inviteCode: 'ABCD1234',
      createdBy: 'u1',
      deletedAt: null,
    });
    groups.countActiveMembers.mockResolvedValue(2);

    const result = await service.getOverview('u1', 'g1');
    expect(result.memberCount).toBe(2);
    expect(result.activityEmpty).toBe(true);
  });

  it('hides overview from non-members', async () => {
    groups.findMembership.mockResolvedValue(null);
    await expect(service.getOverview('u2', 'g1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates an invitation with a one-time token', async () => {
    groups.findMembership.mockResolvedValue({ role: 'owner' });
    groups.findById.mockResolvedValue({
      id: 'g1',
      name: 'Trip',
      inviteCode: 'ABCD1234',
      createdBy: 'u1',
      deletedAt: null,
    });
    groups.createInvitation.mockImplementation(async (input) => {
      return {
        id: input.id,
        groupId: input.groupId,
        email: input.email,
        status: 'pending' as const,
        expiresAt: input.expiresAt,
        createdAt: new Date('2026-11-08T00:00:00.000Z'),
      };
    });

    const result = await service.createInvitation('u1', 'g1', {
      id: '22222222-2222-4222-8222-222222222222',
    });
    expect(result.token).toHaveLength(64);
    expect(groups.createInvitation).toHaveBeenCalled();
  });

  it('accepts a pending invitation', async () => {
    groups.findInvitationByTokenHash.mockResolvedValue({
      id: 'i1',
      groupId: 'g1',
      email: null,
      status: 'pending',
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
    });
    groups.findById.mockResolvedValue({
      id: 'g1',
      name: 'Trip',
      inviteCode: 'ABCD1234',
      createdBy: 'owner',
      deletedAt: null,
    });
    groups.findMembership.mockResolvedValue(null);
    groups.addMember.mockResolvedValue(undefined);
    groups.countActiveMembers.mockResolvedValue(2);

    const result = await service.acceptInvitation('u2', {
      token: 'a'.repeat(64),
    });
    expect(result.role).toBe('member');
    expect(groups.updateInvitationStatus).toHaveBeenCalledWith(
      'i1',
      'accepted',
    );
  });

  it('revokes a pending invitation', async () => {
    groups.findMembership.mockResolvedValue({ role: 'owner' });
    groups.findById.mockResolvedValue({
      id: 'g1',
      name: 'Trip',
      inviteCode: 'ABCD1234',
      createdBy: 'u1',
      deletedAt: null,
    });
    groups.findInvitation.mockResolvedValue({
      id: 'i1',
      groupId: 'g1',
      email: null,
      status: 'pending',
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
    });

    const result = await service.revokeInvitation('u1', 'g1', 'i1');
    expect(result.status).toBe('revoked');
    expect(groups.updateInvitationStatus).toHaveBeenCalledWith('i1', 'revoked');
  });
});
