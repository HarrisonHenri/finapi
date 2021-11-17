import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterStatementAlterAmountPrecision1635204562143 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "statements",
      "amount",
      new TableColumn({
        name: "amount",
        type: "decimal",
        precision: 10,
        scale: 2,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "statements",
      "amount",
      new TableColumn({
        name: "amount",
        type: "decimal",
        precision: 5,
        scale: 2,
      })
    );
  }

}
