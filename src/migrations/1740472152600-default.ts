import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740472152600 implements MigrationInterface {
    name = 'Default1740472152600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fiscais" ("id" integer NOT NULL, "nome" text NOT NULL, "cpf" character varying(14) NOT NULL, "usuario" text NOT NULL, "senha" text NOT NULL, CONSTRAINT "UQ_6a8409b915cfc8879b47664a325" UNIQUE ("cpf"), CONSTRAINT "PK_4372c1b230faa4445a21a2f6fd0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "fiscais"`);
    }

}
