import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppleSignInOauthIdentities1762580000000
  implements MigrationInterface
{
  name = 'AppleSignInOauthIdentities1762580000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "password_hash" DROP NOT NULL
    `);

    await queryRunner.query(`
      CREATE TABLE "oauth_identities" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "provider" character varying(32) NOT NULL,
        "provider_subject" character varying(255) NOT NULL,
        "email" character varying(254),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        CONSTRAINT "PK_oauth_identities_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_oauth_identities_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_oauth_identities_provider_subject_active"
      ON "oauth_identities" ("provider", "provider_subject")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_oauth_identities_user_id"
      ON "oauth_identities" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_oauth_identities_user_id"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_oauth_identities_provider_subject_active"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "oauth_identities"`);
    await queryRunner.query(`
      UPDATE "users" SET "password_hash" = '' WHERE "password_hash" IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "password_hash" SET NOT NULL
    `);
  }
}
