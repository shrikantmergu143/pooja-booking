import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerBirthDetails1792769100000 implements MigrationInterface {
  name = 'CustomerBirthDetails1792769100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "rashi" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "dateOfBirth" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "birthPlace" character varying(150)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "birthPlace"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "dateOfBirth"`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "rashi"`);
  }
}
