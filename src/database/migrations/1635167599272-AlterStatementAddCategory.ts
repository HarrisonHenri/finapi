import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterStatementAddCategory1635167599272 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        "statements",
        new TableColumn({
          name: "category",
          type: "varchar",
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("statements", "category");
    }

}
