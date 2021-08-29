import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

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
    const user = {
      name: "Name",
      email: "Email",
      password: "Password"
    }
    const userCreated = await usersRepositoryInMemory.create(user)

    const statementCreated = await createStatementUseCase.execute(
      { type:OperationType.DEPOSIT, amount:10, description:'Description', user_id: userCreated.id as string}
    );
    expect(statementCreated).toHaveProperty("id");
  });
});
