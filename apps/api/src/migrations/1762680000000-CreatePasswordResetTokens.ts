import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordResetTokens1762680000000
  implements MigrationInterface
{
  name = 'CreatePasswordResetTokens1762680000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add password_changed_at to users (used to invalidate JWTs in Phase 2)
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "password_changed_at" TIMESTAMPTZ
    `);

    await queryRunner.query(`
      CREATE TABLE "password_reset_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "token_hash" character varying(128) NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "consumed_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        CONSTRAINT "PK_password_reset_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_password_reset_tokens_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_tokens_user_id"
      ON "password_reset_tokens" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_password_reset_tokens_token_hash"
      ON "password_reset_tokens" ("token_hash")
      WHERE "consumed_at" IS NULL AND "deleted_at" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_password_reset_tokens_token_hash"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_password_reset_tokens_user_id"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "password_reset_tokens"`);
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "password_changed_at"
    `);
  }
}
