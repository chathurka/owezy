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
