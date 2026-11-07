import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import {
  CreateEmailVerificationTokenInput,
  CreateUserInput,
  UserRepository,
} from '../domain/user.repository';
import { EmailVerificationTokenOrmEntity } from './email-verification-token.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(EmailVerificationTokenOrmEntity)
    private readonly tokens: Repository<EmailVerificationTokenOrmEntity>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    const row = await this.users
      .createQueryBuilder('u')
      .where('LOWER(u.email) = :email', { email: normalized })
      .andWhere('u.deleted_at IS NULL')
      .getOne();

    return row ? this.toDomain(row) : null;
  }

  async createUserWithVerificationToken(
    input: CreateUserInput,
    token: CreateEmailVerificationTokenInput,
  ): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(UserOrmEntity);
      const tokenRepo = manager.getRepository(EmailVerificationTokenOrmEntity);

      const user = userRepo.create({
        email: input.email.trim().toLowerCase(),
        passwordHash: input.passwordHash,
        fullName: input.fullName.trim(),
        role: input.role,
        emailVerified: input.emailVerified,
        defaultCurrency: input.defaultCurrency,
      });
      const saved = await userRepo.save(user);

      await tokenRepo.save(
        tokenRepo.create({
          userId: saved.id,
          tokenHash: token.tokenHash,
          expiresAt: token.expiresAt,
          consumedAt: null,
        }),
      );

      return this.toDomain(saved);
    });
  }

  toDomain(row: UserOrmEntity): User {
    return new User(
      row.id,
      row.email,
      row.passwordHash,
      row.fullName,
      row.role as User['role'],
      row.emailVerified,
      row.defaultCurrency,
      row.createdAt,
      row.updatedAt,
      row.deletedAt ?? null,
    );
  }
}
