import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminMfaAndRoleSupport1762880000000 implements MigrationInterface {
  name = 'AdminMfaAndRoleSupport1762880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "mfa_enabled" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "mfa_secret" character varying(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "mfa_secret"
    `);
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "mfa_enabled"
    `);
  }
}
