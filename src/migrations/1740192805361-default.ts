import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740192805361 implements MigrationInterface {
    name = 'Default1740192805361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infracoes" DROP CONSTRAINT "FK_08caf795b1f9bf0e22533ae1a37"`);
        await queryRunner.query(`CREATE TABLE "viajantes" ("id" SERIAL NOT NULL, "nome" text NOT NULL, "dataNascimento" date NOT NULL, "numeroPassaporte" text NOT NULL, CONSTRAINT "PK_8d449f56a01bb4cca4d5e3a5b00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD CONSTRAINT "FK_08caf795b1f9bf0e22533ae1a37" FOREIGN KEY ("viajante_id") REFERENCES "viajantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infracoes" DROP CONSTRAINT "FK_08caf795b1f9bf0e22533ae1a37"`);
        await queryRunner.query(`DROP TABLE "viajantes"`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD CONSTRAINT "FK_08caf795b1f9bf0e22533ae1a37" FOREIGN KEY ("viajante_id") REFERENCES "viajante"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
