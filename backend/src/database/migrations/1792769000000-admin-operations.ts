import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminOperations1792769000000 implements MigrationInterface {
  name = 'AdminOperations1792769000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "poojas" ADD COLUMN IF NOT EXISTS "supported_cities" text`);
    await queryRunner.query(`ALTER TABLE "poojas" ADD COLUMN IF NOT EXISTS "addons" jsonb`);
    await queryRunner.query(`ALTER TABLE "pandits" ADD COLUMN IF NOT EXISTS "supported_cities" text`);
    await queryRunner.query(`ALTER TABLE "pandits" ADD COLUMN IF NOT EXISTS "eligible_pooja_ids" text`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "app_settings" (
        "key" character varying(50) NOT NULL,
        "value" jsonb NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_app_settings_key" PRIMARY KEY ("key")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "booking_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid NOT NULL,
        "previousStatus" character varying(40),
        "newStatus" character varying(40) NOT NULL,
        "previousPanditId" uuid,
        "newPanditId" uuid,
        "previousAppointmentStartsAt" TIMESTAMP WITH TIME ZONE,
        "newAppointmentStartsAt" TIMESTAMP WITH TIME ZONE,
        "changedBy" character varying(150) NOT NULL,
        "eventType" character varying(40) NOT NULL,
        "notes" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_booking_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_booking_history_booking" FOREIGN KEY ("bookingId")
          REFERENCES "bookings"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_booking_history_bookingId" ON "booking_history" ("bookingId")`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "custom_quotes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid NOT NULL,
        "bookingReference" character varying(50) NOT NULL,
        "customerName" character varying(150) NOT NULL,
        "customerPhone" character varying(20) NOT NULL,
        "customPoojaName" character varying(255) NOT NULL,
        "version" integer NOT NULL,
        "proposedAmount" numeric(10,2) NOT NULL,
        "currency" character varying(10) NOT NULL DEFAULT 'INR',
        "quoteDetails" text NOT NULL,
        "exclusions" text,
        "status" character varying(20) NOT NULL DEFAULT 'SENT',
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "assignedPanditId" uuid,
        "sentAt" TIMESTAMP WITH TIME ZONE,
        "acceptedAt" TIMESTAMP WITH TIME ZONE,
        "rejectedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_custom_quotes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_custom_quotes_booking" FOREIGN KEY ("bookingId")
          REFERENCES "bookings"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_custom_quotes_bookingId" ON "custom_quotes" ("bookingId")`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notification_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid,
        "bookingReference" character varying(50),
        "notificationType" character varying(40) NOT NULL,
        "recipient" character varying(255),
        "subject" character varying(255) NOT NULL,
        "contentSnippet" text NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'PENDING',
        "attemptCount" integer NOT NULL DEFAULT 0,
        "providerMessageId" character varying(255),
        "errorMessage" text,
        "sentAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notification_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_notification_logs_booking" FOREIGN KEY ("bookingId")
          REFERENCES "bookings"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_notification_logs_bookingId" ON "notification_logs" ("bookingId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notification_logs"`);
    await queryRunner.query(`DROP TABLE "custom_quotes"`);
    await queryRunner.query(`DROP TABLE "booking_history"`);
    await queryRunner.query(`DROP TABLE "app_settings"`);
    await queryRunner.query(`ALTER TABLE "pandits" DROP COLUMN "eligible_pooja_ids"`);
    await queryRunner.query(`ALTER TABLE "pandits" DROP COLUMN "supported_cities"`);
    await queryRunner.query(`ALTER TABLE "poojas" DROP COLUMN "addons"`);
    await queryRunner.query(`ALTER TABLE "poojas" DROP COLUMN "supported_cities"`);
  }
}
