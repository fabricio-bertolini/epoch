import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740278248443 implements MigrationInterface {
    name = 'Default1740278248443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infracoes" DROP COLUMN "numeroPassaporte"`);
        await queryRunner.query(`ALTER TABLE "infracoes" ALTER COLUMN "descricao" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infracoes" ALTER COLUMN "descricao" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD "numeroPassaporte" text NOT NULL`);
    }

}
