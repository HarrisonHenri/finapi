import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
const user = {
  name: "Name",
  email: "Email",
  password: "Password"
};
enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });
  it("should be able to create a new deposit statement", async () => {
    const userCreated = await usersRepositoryInMemory.create(user)

    const statementCreated = await createStatementUseCase.execute(
      { type:OperationType.DEPOSIT, amount:10, description:'Description', user_id: userCreated.id as string}
    );
    expect(statementCreated).toHaveProperty("id");
  });
  it("should be able to create a new withdraw statement", async () => {
    const userCreated = await usersRepositoryInMemory.create(user)

    await createStatementUseCase.execute(
      { type:OperationType.DEPOSIT, amount:10, description:'Description', user_id: userCreated.id as string}
    );
    const statementCreated = await createStatementUseCase.execute(
      { type:OperationType.WITHDRAW, amount:10, description:'Description', user_id: userCreated.id as string}
    );
    expect(statementCreated).toHaveProperty("id");
  });
});
