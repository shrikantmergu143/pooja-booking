import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1792763490434 implements MigrationInterface {
    name = 'Init1792763490434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pooja_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "slug" character varying(150) NOT NULL, "description" text, "image_url" character varying(500), "sort_order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "seo_title" character varying(255), "seo_description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_d7298437d8e027b24035f2148ff" UNIQUE ("slug"), CONSTRAINT "PK_ec9c53e0abdc98c755534cd6acd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d7298437d8e027b24035f2148f" ON "pooja_categories" ("slug") `);
        await queryRunner.query(`CREATE TABLE "package_inclusions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "package_id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" text, "itemText" text, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_29eb49154d5e9eda035b50ad3d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_90940ac72d2f670186f5b46fba" ON "package_inclusions" ("package_id") `);
        await queryRunner.query(`CREATE TABLE "pooja_packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pooja_id" uuid NOT NULL, "name" character varying(150) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "currency" character varying(10) NOT NULL DEFAULT 'INR', "duration_minutes" integer NOT NULL DEFAULT '120', "pandit_count" integer NOT NULL DEFAULT '1', "includes_samagri" boolean NOT NULL DEFAULT true, "includes_dakshina" boolean NOT NULL DEFAULT true, "default_pandit_id" uuid, "sort_order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_183457fe767bbfbfff24d16d749" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5dfaaeed7c54cd6baa332ee0ec" ON "pooja_packages" ("pooja_id") `);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying(150) NOT NULL, "email" character varying(255), "phone" character varying(20) NOT NULL, "countryCode" character varying(10) NOT NULL DEFAULT '+91', "preferredLanguage" character varying(50) NOT NULL DEFAULT 'Hindi', "gotra" character varying(100), "sankalpNames" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_88acd889fbe17d0e16cc4bc917" ON "customers" ("phone") `);
        await queryRunner.query(`CREATE TYPE "public"."bookings_bookingtype_enum" AS ENUM('STANDARD', 'CUSTOM')`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_servicemode_enum" AS ENUM('HOME', 'VENUE', 'ONLINE')`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('PENDING', 'AWAITING_CUSTOM_QUOTE', 'QUOTE_SENT', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookingReference" character varying(50) NOT NULL, "customerId" uuid NOT NULL, "poojaId" uuid, "packageId" uuid, "assignedPanditId" uuid, "bookingType" "public"."bookings_bookingtype_enum" NOT NULL DEFAULT 'STANDARD', "customPoojaName" character varying(255), "customRequirements" text, "participantCount" integer NOT NULL DEFAULT '1', "serviceMode" "public"."bookings_servicemode_enum" NOT NULL DEFAULT 'HOME', "serviceAddressSnapshot" jsonb, "preferredLanguage" character varying(50) NOT NULL DEFAULT 'Hindi', "appointmentStartsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "appointmentEndsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'PENDING', "currency" character varying(10) NOT NULL DEFAULT 'INR', "price" numeric(10,2) NOT NULL DEFAULT '0', "approvedQuoteAmount" numeric(10,2), "packageSnapshot" jsonb, "customerDetailsSnapshot" jsonb, "selectedAddonsSnapshot" jsonb, "customerNotes" text, "adminNotes" text, "idempotencyKey" character varying(100), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "confirmedAt" TIMESTAMP WITH TIME ZONE, "cancelledAt" TIMESTAMP WITH TIME ZONE, "completedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_efae15c3deed139b3a0ce03f69c" UNIQUE ("bookingReference"), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_efae15c3deed139b3a0ce03f69" ON "bookings" ("bookingReference") `);
        await queryRunner.query(`CREATE INDEX "IDX_514fec4bce5d9e658be80934f9" ON "bookings" ("appointmentStartsAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef53093ae0efc80b1d41ae51ea" ON "bookings" ("appointmentEndsAt") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c4141e3b61a03e011495f6497a" ON "bookings" ("idempotencyKey") WHERE "idempotencyKey" IS NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."admin_users_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "admin_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "role" "public"."admin_users_role_enum" NOT NULL DEFAULT 'ADMIN', "isActive" boolean NOT NULL DEFAULT true, "lastLoginAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_dcd0c8a4b10af9c986e510b9ecc" UNIQUE ("email"), CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dcd0c8a4b10af9c986e510b9ec" ON "admin_users" ("email") `);
        await queryRunner.query(`CREATE TABLE "pandits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying(150) NOT NULL, "phone" character varying(30) NOT NULL, "email" character varying(255), "profile_image" character varying(500), "biography" text, "experience_years" integer NOT NULL DEFAULT '5', "specializations" text, "languages" text NOT NULL DEFAULT 'Hindi,Sanskrit', "service_areas" text, "supported_modes" text NOT NULL DEFAULT 'HOME,VENUE,ONLINE', "is_active" boolean NOT NULL DEFAULT true, "weekly_schedule" jsonb, "blocked_dates" jsonb, "admin_notes" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3806476d0a17464ba8f55625bd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "poojas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_id" uuid NOT NULL, "name" character varying(200) NOT NULL, "slug" character varying(200) NOT NULL, "short_description" character varying(500) NOT NULL, "description" text NOT NULL, "purpose" text, "ritual_requirements" text, "instructions" text, "duration_minutes" integer NOT NULL DEFAULT '120', "default_pandit_id" uuid, "allow_customer_pandit_preference" boolean NOT NULL DEFAULT true, "min_advance_booking_hours" integer NOT NULL DEFAULT '12', "max_advance_booking_days" integer NOT NULL DEFAULT '60', "supported_modes" text NOT NULL DEFAULT 'HOME,VENUE,ONLINE', "supported_languages" text NOT NULL DEFAULT 'Hindi,Sanskrit', "image_url" character varying(500), "is_active" boolean NOT NULL DEFAULT true, "seo_title" character varying(255), "seo_description" text, "quote" text, "allow_custom_quote" boolean NOT NULL DEFAULT true, "custom_quote_starting_price" numeric(10,2), "custom_quote_notes" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_91551b13ec8e202f4fa02c60777" UNIQUE ("slug"), CONSTRAINT "PK_b932da3be1b08c85c283241752b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_91551b13ec8e202f4fa02c6077" ON "poojas" ("slug") `);
        await queryRunner.query(`ALTER TABLE "package_inclusions" ADD CONSTRAINT "FK_90940ac72d2f670186f5b46fba3" FOREIGN KEY ("package_id") REFERENCES "pooja_packages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pooja_packages" ADD CONSTRAINT "FK_5dfaaeed7c54cd6baa332ee0ec1" FOREIGN KEY ("pooja_id") REFERENCES "poojas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_67b9cd20f987fc6dc70f7cd283f" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_eaafceb966f9dd33f3678a2ff00" FOREIGN KEY ("poojaId") REFERENCES "poojas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_c33a993088cbe955492d812b1b2" FOREIGN KEY ("packageId") REFERENCES "pooja_packages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poojas" ADD CONSTRAINT "FK_e38c1af7f0c6c91c6dc2137ba32" FOREIGN KEY ("category_id") REFERENCES "pooja_categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "poojas" DROP CONSTRAINT "FK_e38c1af7f0c6c91c6dc2137ba32"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_c33a993088cbe955492d812b1b2"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_eaafceb966f9dd33f3678a2ff00"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_67b9cd20f987fc6dc70f7cd283f"`);
        await queryRunner.query(`ALTER TABLE "pooja_packages" DROP CONSTRAINT "FK_5dfaaeed7c54cd6baa332ee0ec1"`);
        await queryRunner.query(`ALTER TABLE "package_inclusions" DROP CONSTRAINT "FK_90940ac72d2f670186f5b46fba3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91551b13ec8e202f4fa02c6077"`);
        await queryRunner.query(`DROP TABLE "poojas"`);
        await queryRunner.query(`DROP TABLE "pandits"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dcd0c8a4b10af9c986e510b9ec"`);
        await queryRunner.query(`DROP TABLE "admin_users"`);
        await queryRunner.query(`DROP TYPE "public"."admin_users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c4141e3b61a03e011495f6497a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef53093ae0efc80b1d41ae51ea"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_514fec4bce5d9e658be80934f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_efae15c3deed139b3a0ce03f69"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_servicemode_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_bookingtype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88acd889fbe17d0e16cc4bc917"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5dfaaeed7c54cd6baa332ee0ec"`);
        await queryRunner.query(`DROP TABLE "pooja_packages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90940ac72d2f670186f5b46fba"`);
        await queryRunner.query(`DROP TABLE "package_inclusions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7298437d8e027b24035f2148f"`);
        await queryRunner.query(`DROP TABLE "pooja_categories"`);
    }

}
