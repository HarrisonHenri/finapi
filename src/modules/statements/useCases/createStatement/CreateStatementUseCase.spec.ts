import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
const user = {
  name: "Name",
  email: "Email",
  password: "Password"
};

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
    expect(statementCreated.description).toBe("Description")
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
    expect(statementCreated.description).toBe("Description")
  });
  it("should not be able to create a new withdraw statement for a user without enough balance", () => {
    expect(async ()=>{
      const userCreated = await usersRepositoryInMemory.create(user)

      await createStatementUseCase.execute(
        { type:OperationType.DEPOSIT, amount:9, description:'Description', user_id: userCreated.id as string}
      );
      await createStatementUseCase.execute(
        { type:OperationType.WITHDRAW, amount:10, description:'Description', user_id: userCreated.id as string}
      );
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });
  it("should not be able to create a new statement for a user not found", () => {
    expect(async ()=>{
     await createStatementUseCase.execute(
        { type:OperationType.DEPOSIT, amount:9, description:'Description', user_id: '123asda21-asd123-as1'}
      );
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });
});
