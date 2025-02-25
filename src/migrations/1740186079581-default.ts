import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740186079581 implements MigrationInterface {
    name = 'Default1740186079581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."infracoes_gravidade_enum" AS ENUM('3', '5', '7', '12')`);
        await queryRunner.query(`CREATE TABLE "infracoes" ("id" SERIAL NOT NULL, "descricao" text NOT NULL, "numeroPassaporte" text NOT NULL, "data" TIMESTAMP NOT NULL, "gravidade" "public"."infracoes_gravidade_enum" NOT NULL, "viajante_id" integer, CONSTRAINT "PK_6a8f42a2d9fb1cd9d19b32f8773" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "viajante" ("id" SERIAL NOT NULL, "nome" text NOT NULL, "dataNascimento" date NOT NULL, "numeroPassaporte" text NOT NULL, CONSTRAINT "PK_b42bc14f31ebed79b6892c2f39e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "infracoes" ADD CONSTRAINT "FK_08caf795b1f9bf0e22533ae1a37" FOREIGN KEY ("viajante_id") REFERENCES "viajante"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "infracoes" DROP CONSTRAINT "FK_08caf795b1f9bf0e22533ae1a37"`);
        await queryRunner.query(`DROP TABLE "viajante"`);
        await queryRunner.query(`DROP TABLE "infracoes"`);
        await queryRunner.query(`DROP TYPE "public"."infracoes_gravidade_enum"`);
    }

}
