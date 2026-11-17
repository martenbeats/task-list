import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregandoPropiedadFechaLimite1794887954044 implements MigrationInterface {
    name = 'AgregandoPropiedadFechaLimite1794887954044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "deadline" TIMESTAMP NOT NULL DEFAULT NOW()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "deadline"`);
    }

}
