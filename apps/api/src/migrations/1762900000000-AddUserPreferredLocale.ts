import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPreferredLocale1762900000000 implements MigrationInterface {
  name = 'AddUserPreferredLocale1762900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "preferred_locale" character varying(16) NOT NULL DEFAULT 'en'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "preferred_locale"
    `);
  }
}
