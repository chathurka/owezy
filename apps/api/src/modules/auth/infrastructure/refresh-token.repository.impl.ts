import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenRepository } from '../domain/refresh-token.repository';
import { RefreshTokenOrmEntity } from './refresh-token.orm-entity';

@Injectable()
export class RefreshTokenRepositoryImpl extends RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repo: Repository<RefreshTokenOrmEntity>,
  ) {
    super();
  }

  async store(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.repo.save(
      this.repo.create({
        userId,
        tokenHash,
        expiresAt,
        revokedAt: null,
      }),
    );
  }

  async findValid(
    tokenHash: string,
  ): Promise<{ id: string; userId: string } | null> {
    const now = new Date();
    const row = await this.repo
      .createQueryBuilder('rt')
      .where('rt.token_hash = :tokenHash', { tokenHash })
      .andWhere('rt.revoked_at IS NULL')
      .andWhere('rt.deleted_at IS NULL')
      .andWhere('rt.expires_at > :now', { now })
      .getOne();

    return row ? { id: row.id, userId: row.userId } : null;
  }

  async revoke(id: string): Promise<void> {
    await this.repo.update(id, { revokedAt: new Date() });
  }

  async revokeByHash(tokenHash: string): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(RefreshTokenOrmEntity)
      .set({ revokedAt: new Date() })
      .where('token_hash = :tokenHash', { tokenHash })
      .andWhere('revoked_at IS NULL')
      .andWhere('deleted_at IS NULL')
      .execute();
  }
}
