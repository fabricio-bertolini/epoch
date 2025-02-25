import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740492150380 implements MigrationInterface {
    name = 'Default1740492150380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "viagens" ADD "infracao_id" integer`);
        await queryRunner.query(`ALTER TABLE "viagens" ADD CONSTRAINT "UQ_d7647e567db26b31be2efd6de48" UNIQUE ("infracao_id")`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD "fiscal_id" integer`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD "viagem_id" integer`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD CONSTRAINT "UQ_edd87cfdf8da6b48544e3e586ea" UNIQUE ("viagem_id")`);
        await queryRunner.query(`ALTER TABLE "viagens" ADD CONSTRAINT "FK_d7647e567db26b31be2efd6de48" FOREIGN KEY ("infracao_id") REFERENCES "infracoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD CONSTRAINT "FK_71b4cd65ba053757168a21d0516" FOREIGN KEY ("fiscal_id") REFERENCES "fiscais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD CONSTRAINT "FK_edd87cfdf8da6b48544e3e586ea" FOREIGN KEY ("viagem_id") REFERENCES "viagens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infracoes" DROP CONSTRAINT "FK_edd87cfdf8da6b48544e3e586ea"`);
        await queryRunner.query(`ALTER TABLE "infracoes" DROP CONSTRAINT "FK_71b4cd65ba053757168a21d0516"`);
        await queryRunner.query(`ALTER TABLE "viagens" DROP CONSTRAINT "FK_d7647e567db26b31be2efd6de48"`);
        await queryRunner.query(`ALTER TABLE "infracoes" DROP CONSTRAINT "UQ_edd87cfdf8da6b48544e3e586ea"`);
        await queryRunner.query(`ALTER TABLE "infracoes" DROP COLUMN "viagem_id"`);
        await queryRunner.query(`ALTER TABLE "infracoes" DROP COLUMN "fiscal_id"`);
        await queryRunner.query(`ALTER TABLE "viagens" DROP CONSTRAINT "UQ_d7647e567db26b31be2efd6de48"`);
        await queryRunner.query(`ALTER TABLE "viagens" DROP COLUMN "infracao_id"`);
    }

}
