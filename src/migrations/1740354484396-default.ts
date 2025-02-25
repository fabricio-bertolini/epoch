import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740354484396 implements MigrationInterface {
    name = 'Default1740354484396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infracoes" DROP COLUMN "gravidade"`);
        await queryRunner.query(`DROP TYPE "public"."infracoes_gravidade_enum"`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD "gravidade" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infracoes" DROP COLUMN "gravidade"`);
        await queryRunner.query(`CREATE TYPE "public"."infracoes_gravidade_enum" AS ENUM('3', '5', '7', '12')`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD "gravidade" "public"."infracoes_gravidade_enum" NOT NULL`);
    }

}
