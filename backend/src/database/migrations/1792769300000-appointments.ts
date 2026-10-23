import { MigrationInterface, QueryRunner } from 'typeorm';

export class Appointments1792769300000 implements MigrationInterface {
  name = 'Appointments1792769300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "appointments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(150) NOT NULL,
        "gotra" character varying(150) NOT NULL,
        "rashi" character varying(100) NOT NULL,
        "dateOfBirth" date NOT NULL,
        "place" character varying(180) NOT NULL,
        "appointmentDate" date NOT NULL,
        "appointmentTime" time without time zone NOT NULL,
        "mobileNumber" character varying(30) NOT NULL,
        "email" character varying(255),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_appointments" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_appointments_appointmentDate_appointmentTime" ON "appointments" ("appointmentDate", "appointmentTime")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "appointments"`);
  }
}
