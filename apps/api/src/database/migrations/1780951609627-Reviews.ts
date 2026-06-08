import { MigrationInterface, QueryRunner } from "typeorm";

export class Reviews1780951609627 implements MigrationInterface {
    name = 'Reviews1780951609627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "userId" uuid NOT NULL, "authorName" character varying NOT NULL, "rating" integer NOT NULL, "title" character varying NOT NULL DEFAULT '', "body" text NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9007ffba411fd471dfe233dabf" ON "reviews" ("productId", "userId") `);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9007ffba411fd471dfe233dabf"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
    }

}
