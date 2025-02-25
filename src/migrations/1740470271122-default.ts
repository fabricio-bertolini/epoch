import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740470271122 implements MigrationInterface {
    name = 'Default1740470271122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "viajantes" DROP CONSTRAINT "UQ_762359a320d8d7561fbbdf1e709"`);
        await queryRunner.query(`ALTER TABLE "viajantes" DROP COLUMN "numeroPassaporte"`);
        await queryRunner.query(`ALTER TABLE "viajantes" ADD "numeroPassaporte" character varying(8) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "viajantes" ADD CONSTRAINT "UQ_762359a320d8d7561fbbdf1e709" UNIQUE ("numeroPassaporte")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "viajantes" DROP CONSTRAINT "UQ_762359a320d8d7561fbbdf1e709"`);
        await queryRunner.query(`ALTER TABLE "viajantes" DROP COLUMN "numeroPassaporte"`);
        await queryRunner.query(`ALTER TABLE "viajantes" ADD "numeroPassaporte" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "viajantes" ADD CONSTRAINT "UQ_762359a320d8d7561fbbdf1e709" UNIQUE ("numeroPassaporte")`);
    }

}
