import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroupInvitations1762920000000 implements MigrationInterface {
  name = 'CreateGroupInvitations1762920000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "group_invitations" (
        "id" uuid NOT NULL,
        "group_id" uuid NOT NULL,
        "invited_by" uuid NOT NULL,
        "email" varchar(320),
        "token_hash" varchar(64) NOT NULL,
        "status" varchar(16) NOT NULL DEFAULT 'pending',
        "expires_at" TIMESTAMPTZ NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        CONSTRAINT "PK_group_invitations" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_group_invitations_token_hash_active"
      ON "group_invitations" ("token_hash")
      WHERE "deleted_at" IS NULL
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_group_invitations_group_id"
      ON "group_invitations" ("group_id")
      WHERE "deleted_at" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_group_invitations_group_id"`);
    await queryRunner.query(
      `DROP INDEX "UQ_group_invitations_token_hash_active"`,
    );
    await queryRunner.query(`DROP TABLE "group_invitations"`);
  }
}
