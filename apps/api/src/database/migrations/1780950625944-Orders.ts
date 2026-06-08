import { MigrationInterface, QueryRunner } from "typeorm";

export class Orders1780950625944 implements MigrationInterface {
    name = 'Orders1780950625944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" uuid NOT NULL, "skuId" uuid, "productName" character varying NOT NULL, "brand" character varying NOT NULL DEFAULT '', "color" character varying NOT NULL DEFAULT '', "size" character varying NOT NULL DEFAULT '', "image" character varying, "unitEur" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "email" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "deliveryMethod" character varying NOT NULL, "fullName" character varying NOT NULL, "phone" character varying NOT NULL DEFAULT '', "line1" character varying NOT NULL, "city" character varying NOT NULL, "postalCode" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'BG', "subtotalEur" integer NOT NULL, "shippingEur" integer NOT NULL, "totalEur" integer NOT NULL, "paymentIntentId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
    }

}
