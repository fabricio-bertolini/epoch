import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740472230333 implements MigrationInterface {
    name = 'Default1740472230333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fiscais" ADD CONSTRAINT "UQ_56617a1ca7171467a1ca9d2f4dd" UNIQUE ("usuario")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fiscais" DROP CONSTRAINT "UQ_56617a1ca7171467a1ca9d2f4dd"`);
    }

}
