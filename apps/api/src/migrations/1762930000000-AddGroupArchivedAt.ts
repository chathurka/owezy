import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGroupArchivedAt1762930000000 implements MigrationInterface {
  name = 'AddGroupArchivedAt1762930000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "groups"
      ADD COLUMN "archived_at" TIMESTAMPTZ
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "groups"
      DROP COLUMN "archived_at"
    `);
  }
}
