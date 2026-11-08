import { UserOrmEntity } from './user.orm-entity';
import { UserRepositoryImpl } from './user.repository.impl';

describe('UserRepositoryImpl', () => {
  it('maps ORM rows to domain users including soft-delete', () => {
    const repo = Object.create(UserRepositoryImpl.prototype) as UserRepositoryImpl;
    const row = new UserOrmEntity();
    row.id = '22222222-2222-4222-8222-222222222222';
    row.email = 'casey@example.com';
    row.passwordHash = 'hash';
    row.fullName = 'Casey Lee';
    row.role = 'user';
    row.emailVerified = false;
    row.defaultCurrency = 'LKR';
    row.createdAt = new Date('2026-11-07T00:00:00.000Z');
    row.updatedAt = new Date('2026-11-07T00:00:00.000Z');
    row.deletedAt = null;

    const user = repo.toDomain(row);

    expect(user.id).toBe(row.id);
    expect(user.email).toBe('casey@example.com');
    expect(user.fullName).toBe('Casey Lee');
    expect(user.defaultCurrency).toBe('LKR');
    expect(user.deletedAt).toBeNull();
  });

  it('normalizes email lookup query via findActiveByEmail contract', async () => {
    const getOne = jest.fn().mockResolvedValue(null);
    const andWhere = jest.fn().mockReturnValue({ getOne });
    const where = jest.fn().mockReturnValue({ andWhere });
    const createQueryBuilder = jest.fn().mockReturnValue({ where });

    const repo = new UserRepositoryImpl(
      { createQueryBuilder } as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await repo.findActiveByEmail('  Alex@Example.COM ');

    expect(where).toHaveBeenCalledWith('LOWER(u.email) = :email', {
      email: 'alex@example.com',
    });
    expect(andWhere).toHaveBeenCalledWith('u.deleted_at IS NULL');
  });
});
