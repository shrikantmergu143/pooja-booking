import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckUpdate1792914539114 implements MigrationInterface {
    name = 'CheckUpdate1792914539114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_history_bookingId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_custom_quotes_bookingId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_notification_logs_bookingId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_contact_messages_status_createdAt"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_appointments_appointmentDate_appointmentTime"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "appointmentDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "appointmentTime" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_42c045b0a6a10841014bf681e7" ON "appointments" ("appointmentDate", "appointmentTime") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_42c045b0a6a10841014bf681e7"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "appointmentTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "appointmentDate" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_appointments_appointmentDate_appointmentTime" ON "appointments" ("appointmentDate", "appointmentTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_contact_messages_status_createdAt" ON "contact_messages" ("createdAt", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_notification_logs_bookingId" ON "notification_logs" ("bookingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_custom_quotes_bookingId" ON "custom_quotes" ("bookingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_history_bookingId" ON "booking_history" ("bookingId") `);
    }

}
