import { MigrationInterface, QueryRunner } from "typeorm";

export class YourMigrationName1746064679842 implements MigrationInterface {
    name = 'YourMigrationName1746064679842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "assignedToId" integer`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_c91bd53ca8f760496cab04f79c7" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_c91bd53ca8f760496cab04f79c7"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "assignedToId"`);
    }

}
