import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCatalog1780944627262 implements MigrationInterface {
    name = 'InitialCatalog1780944627262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b15428f362be2200922952dc26" ON "brands" ("slug") `);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "position" integer NOT NULL DEFAULT '0', "parentId" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_420d9f679d41281f282f5bc7d0" ON "categories" ("slug") `);
        await queryRunner.query(`CREATE TABLE "prices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "currentEur" integer NOT NULL, "oldEur" integer, "discountPct" integer, "promoStart" TIMESTAMP WITH TIME ZONE, "promoEnd" TIMESTAMP WITH TIME ZONE, CONSTRAINT "REL_fe932c923ecd4abc3f0ac91573" UNIQUE ("productId"), CONSTRAINT "PK_2e40b9e4e631a53cd514d82ccd2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text NOT NULL DEFAULT '', "brandId" uuid NOT NULL, "categoryId" uuid NOT NULL, "ratingAvg" numeric(2,1) NOT NULL DEFAULT '0', "reviewCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_464f927ae360106b783ed0b410" ON "products" ("slug") `);
        await queryRunner.query(`CREATE TABLE "product_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "variantId" uuid NOT NULL, "url" character varying NOT NULL, "position" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_variants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "colorName" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ac30e35b87801fc740d0e52b33" ON "product_variants" ("slug") `);
        await queryRunner.query(`CREATE TABLE "skus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "variantId" uuid NOT NULL, "size" character varying NOT NULL, "stock" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_334d59b0b01e5f2193966266e27" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prices" ADD CONSTRAINT "FK_fe932c923ecd4abc3f0ac915736" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_7f1a676cadb42cc18fe9a367608" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_f515690c571a03400a9876600b5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skus" ADD CONSTRAINT "FK_e7d4bf92a1ca2cd8cf3443bc6f5" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skus" DROP CONSTRAINT "FK_e7d4bf92a1ca2cd8cf3443bc6f5"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_f515690c571a03400a9876600b5"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_7f1a676cadb42cc18fe9a367608"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`ALTER TABLE "prices" DROP CONSTRAINT "FK_fe932c923ecd4abc3f0ac915736"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`);
        await queryRunner.query(`DROP TABLE "skus"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac30e35b87801fc740d0e52b33"`);
        await queryRunner.query(`DROP TABLE "product_variants"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_464f927ae360106b783ed0b410"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "prices"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_420d9f679d41281f282f5bc7d0"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b15428f362be2200922952dc26"`);
        await queryRunner.query(`DROP TABLE "brands"`);
    }

}
