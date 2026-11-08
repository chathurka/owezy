import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroupsAndOnboarding1762910000000
  implements MigrationInterface
{
  name = 'CreateGroupsAndOnboarding1762910000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "group_onboarding_completed_at" TIMESTAMPTZ
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "groups" (
        "id" uuid PRIMARY KEY,
        "name" character varying(100) NOT NULL,
        "invite_code" character varying(16) NOT NULL,
        "created_by" uuid NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_groups_invite_code_active"
      ON "groups" ("invite_code")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "group_members" (
        "id" uuid PRIMARY KEY,
        "group_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "role" character varying(16) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_group_members_active"
      ON "group_members" ("group_id", "user_id")
      WHERE "deleted_at" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "group_members"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "groups"`);
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "group_onboarding_completed_at"
    `);
  }
}
