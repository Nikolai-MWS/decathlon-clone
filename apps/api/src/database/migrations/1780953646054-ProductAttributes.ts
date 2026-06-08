import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductAttributes1780953646054 implements MigrationInterface {
    name = 'ProductAttributes1780953646054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "section" character varying NOT NULL, "label" character varying NOT NULL DEFAULT '', "value" text NOT NULL DEFAULT '', "position" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_4fa18fc5c893cb9894fc40ca921" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ADD CONSTRAINT "FK_5b71e4ee5c131f84708b9a0f358" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" DROP CONSTRAINT "FK_5b71e4ee5c131f84708b9a0f358"`);
        await queryRunner.query(`DROP TABLE "product_attributes"`);
    }

}
