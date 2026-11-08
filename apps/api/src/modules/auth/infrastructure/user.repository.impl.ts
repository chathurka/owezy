import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import {
  CreateAppleUserInput,
  CreateEmailVerificationTokenInput,
  CreateUserInput,
  UserRepository,
} from '../domain/user.repository';
import { EmailVerificationTokenOrmEntity } from './email-verification-token.orm-entity';
import { OauthIdentityOrmEntity } from './oauth-identity.orm-entity';
import { PasswordResetTokenOrmEntity } from './password-reset-token.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

const APPLE_PROVIDER = 'apple';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(EmailVerificationTokenOrmEntity)
    private readonly tokens: Repository<EmailVerificationTokenOrmEntity>,
    @InjectRepository(OauthIdentityOrmEntity)
    private readonly oauthIdentities: Repository<OauthIdentityOrmEntity>,
    @InjectRepository(PasswordResetTokenOrmEntity)
    private readonly resetTokens: Repository<PasswordResetTokenOrmEntity>,
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

  async findActiveByAppleSubject(appleSubject: string): Promise<User | null> {
    const row = await this.users
      .createQueryBuilder('u')
      .innerJoin(
        OauthIdentityOrmEntity,
        'o',
        'o.user_id = u.id AND o.deleted_at IS NULL',
      )
      .where('o.provider = :provider', { provider: APPLE_PROVIDER })
      .andWhere('o.provider_subject = :subject', { subject: appleSubject })
      .andWhere('u.deleted_at IS NULL')
      .getOne();

    return row ? this.toDomain(row) : null;
  }

  async findAppleSubjectByUserId(userId: string): Promise<string | null> {
    const row = await this.oauthIdentities
      .createQueryBuilder('o')
      .where('o.user_id = :userId', { userId })
      .andWhere('o.provider = :provider', { provider: APPLE_PROVIDER })
      .andWhere('o.deleted_at IS NULL')
      .getOne();

    return row?.providerSubject ?? null;
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

  async createAppleUser(input: CreateAppleUserInput): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(UserOrmEntity);
      const oauthRepo = manager.getRepository(OauthIdentityOrmEntity);

      const user = userRepo.create({
        email: input.email.trim().toLowerCase(),
        passwordHash: null,
        fullName: input.fullName.trim(),
        role: 'user',
        emailVerified: input.emailVerified,
        defaultCurrency: input.defaultCurrency,
      });
      const saved = await userRepo.save(user);

      await oauthRepo.save(
        oauthRepo.create({
          userId: saved.id,
          provider: APPLE_PROVIDER,
          providerSubject: input.appleSubject,
          email: input.email.trim().toLowerCase(),
          deletedAt: null,
        }),
      );

      return this.toDomain(saved);
    });
  }

  async linkAppleIdentity(
    userId: string,
    appleSubject: string,
    email: string | null,
  ): Promise<void> {
    await this.oauthIdentities.save(
      this.oauthIdentities.create({
        userId,
        provider: APPLE_PROVIDER,
        providerSubject: appleSubject,
        email: email ? email.trim().toLowerCase() : null,
        deletedAt: null,
      }),
    );
  }

  async consumeVerificationToken(
    tokenHash: string,
  ): Promise<{ userId: string; email: string } | null> {
    const now = new Date();
    return this.dataSource.transaction(async (manager) => {
      const tokenRepo = manager.getRepository(EmailVerificationTokenOrmEntity);
      const userRepo = manager.getRepository(UserOrmEntity);

      const token = await tokenRepo
        .createQueryBuilder('t')
        .where('t.token_hash = :tokenHash', { tokenHash })
        .andWhere('t.consumed_at IS NULL')
        .andWhere('t.expires_at > :now', { now })
        .getOne();

      if (!token) return null;

      await tokenRepo.update(token.id, { consumedAt: now });

      const user = await userRepo.findOneBy({ id: token.userId });
      if (!user) return null;

      return { userId: user.id, email: user.email };
    });
  }

  async rotateVerificationToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.tokens.save(
      this.tokens.create({
        userId,
        tokenHash,
        expiresAt,
        consumedAt: null,
      }),
    );
  }

  async findLatestVerificationTokenCreatedAt(
    email: string,
  ): Promise<{ userId: string; createdAt: Date } | null> {
    const normalized = email.trim().toLowerCase();
    const row = await this.tokens
      .createQueryBuilder('t')
      .innerJoin(UserOrmEntity, 'u', 'u.id = t.user_id')
      .where('LOWER(u.email) = :email', { email: normalized })
      .andWhere('u.deleted_at IS NULL')
      .andWhere('u.email_verified = false')
      .andWhere('t.consumed_at IS NULL')
      .orderBy('t.created_at', 'DESC')
      .select(['t.user_id AS "userId"', 't.created_at AS "createdAt"'])
      .getRawOne<{ userId: string; createdAt: Date }>();

    return row ?? null;
  }

  async markEmailVerified(userId: string): Promise<{ email: string }> {
    await this.users.update(userId, { emailVerified: true });
    const user = await this.users.findOneBy({ id: userId });
    return { email: user!.email };
  }

  // ── Password reset ────────────────────────────────────────────────────────

  async createPasswordResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.resetTokens.save(
      this.resetTokens.create({
        userId,
        tokenHash,
        expiresAt,
        consumedAt: null,
      }),
    );
  }

  async findLatestPasswordResetTokenCreatedAt(
    email: string,
  ): Promise<{ userId: string; createdAt: Date } | null> {
    const normalized = email.trim().toLowerCase();
    const row = await this.resetTokens
      .createQueryBuilder('r')
      .innerJoin(UserOrmEntity, 'u', 'u.id = r.user_id')
      .where('LOWER(u.email) = :email', { email: normalized })
      .andWhere('u.deleted_at IS NULL')
      .andWhere('r.consumed_at IS NULL')
      .andWhere('r.deleted_at IS NULL')
      .orderBy('r.created_at', 'DESC')
      .select(['r.user_id AS "userId"', 'r.created_at AS "createdAt"'])
      .getRawOne<{ userId: string; createdAt: Date }>();

    // Also return userId even if no token exists yet (for first reset request)
    // Actually: we only need user lookup; return null if no active user found.
    if (row) return row;

    // No existing token — check if active user exists to allow first-time reset
    const userRow = await this.users
      .createQueryBuilder('u')
      .where('LOWER(u.email) = :email', { email: normalized })
      .andWhere('u.deleted_at IS NULL')
      .select(['u.id AS "userId"'])
      .getRawOne<{ userId: string }>();

    if (!userRow) return null;

    return { userId: userRow.userId, createdAt: new Date(0) };
  }

  async consumePasswordResetToken(
    tokenHash: string,
  ): Promise<{ userId: string } | null> {
    const now = new Date();
    return this.dataSource.transaction(async (manager) => {
      const tokenRepo = manager.getRepository(PasswordResetTokenOrmEntity);

      const token = await tokenRepo
        .createQueryBuilder('r')
        .where('r.token_hash = :tokenHash', { tokenHash })
        .andWhere('r.consumed_at IS NULL')
        .andWhere('r.deleted_at IS NULL')
        .andWhere('r.expires_at > :now', { now })
        .getOne();

      if (!token) return null;

      await tokenRepo.update(token.id, { consumedAt: now });

      return { userId: token.userId };
    });
  }

  async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    await this.users.update(userId, {
      passwordHash,
      passwordChangedAt: new Date(),
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
