import { MigrationInterface, QueryRunner } from "typeorm";

export class Engagement1780952185301 implements MigrationInterface {
    name = 'Engagement1780952185301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wishlists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d0a37f2848c5d268d315325f359" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlist_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "wishlistId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_0bd52924a97cda208ed2a07bd69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_61a45550812312e4f90ac99363" ON "wishlist_items" ("wishlistId", "productId") `);
        await queryRunner.query(`CREATE TABLE "stock_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "skuId" uuid NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c0f4c0af55afa3f986ec6fcd129" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "newsletter_subscribers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_38f9333e9961b2fdb589128d19b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0dc48416511f011f7de7b2a8f8" ON "newsletter_subscribers" ("email") `);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD CONSTRAINT "FK_afee7b38d9a4d8e1039e3a0de49" FOREIGN KEY ("wishlistId") REFERENCES "wishlists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP CONSTRAINT "FK_afee7b38d9a4d8e1039e3a0de49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0dc48416511f011f7de7b2a8f8"`);
        await queryRunner.query(`DROP TABLE "newsletter_subscribers"`);
        await queryRunner.query(`DROP TABLE "stock_notifications"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_61a45550812312e4f90ac99363"`);
        await queryRunner.query(`DROP TABLE "wishlist_items"`);
        await queryRunner.query(`DROP TABLE "wishlists"`);
    }

}
