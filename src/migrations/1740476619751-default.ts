import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740476619751 implements MigrationInterface {
    name = 'Default1740476619751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "fiscais_id_seq" OWNED BY "fiscais"."id"`);
        await queryRunner.query(`ALTER TABLE "fiscais" ALTER COLUMN "id" SET DEFAULT nextval('"fiscais_id_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fiscais" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "fiscais_id_seq"`);
    }

}
