import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740382746241 implements MigrationInterface {
    name = 'Default1740382746241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "viajantes" DROP COLUMN "dataNascimento"`);
        await queryRunner.query(`ALTER TABLE "viajantes" ADD "dataNascimento" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "viajantes" DROP COLUMN "dataNascimento"`);
        await queryRunner.query(`ALTER TABLE "viajantes" ADD "dataNascimento" date NOT NULL`);
    }

}
