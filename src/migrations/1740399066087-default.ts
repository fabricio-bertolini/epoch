import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740399066087 implements MigrationInterface {
    name = 'Default1740399066087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "viagens" ("id" SERIAL NOT NULL, "descricao" text, "dataDestino" TIMESTAMP NOT NULL, "dataDaViagem" TIMESTAMP NOT NULL, "viajante_id" integer, CONSTRAINT "PK_4c6e58f5f2410f02f9246a2bd14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "viagens" ADD CONSTRAINT "FK_a5ee6e68c8fe6e5ca3378de4883" FOREIGN KEY ("viajante_id") REFERENCES "viajantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "viagens" DROP CONSTRAINT "FK_a5ee6e68c8fe6e5ca3378de4883"`);
        await queryRunner.query(`DROP TABLE "viagens"`);
    }

}
