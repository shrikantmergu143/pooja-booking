import { MigrationInterface, QueryRunner } from 'typeorm';

export class SiteContentAndBookingArchive1792769200000 implements MigrationInterface {
  name = 'SiteContentAndBookingArchive1792769200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "content_pages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" character varying(100) NOT NULL,
        "title" character varying(180) NOT NULL,
        "contentHtml" text NOT NULL DEFAULT '',
        "status" character varying(20) NOT NULL DEFAULT 'DRAFT',
        "seoTitle" character varying(255),
        "seoDescription" character varying(500),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_content_pages" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_content_pages_slug" UNIQUE ("slug")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "contact_messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(150) NOT NULL,
        "email" character varying(255) NOT NULL,
        "phone" character varying(30),
        "subject" character varying(180) NOT NULL,
        "message" text NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'NEW',
        "adminNotes" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contact_messages" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_contact_messages_status_createdAt" ON "contact_messages" ("status", "createdAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contact_messages"`);
    await queryRunner.query(`DROP TABLE "content_pages"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "archivedAt"`);
  }
}
