import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
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

describe("Get Balances", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory,
    );
  });
  it("should be able to get the user statement", async () => {
    const userCreated = await usersRepositoryInMemory.create(user)
    const statement = {
      type: OperationType.DEPOSIT,
      amount:10,
      description:'Description',
      user_id: userCreated.id as string
    }
    const statementCreated = await statementsRepositoryInMemory.create(statement);

    const statementFound = await getStatementOperationUseCase.execute({
      user_id:userCreated.id as string,
      statement_id:statementCreated.id as string
    })
    expect(statementFound.amount).toBe(statement.amount);
  });
  it("should not be able to get the user statement when the user is not found", () => {
    expect(async ()=>{
      await getStatementOperationUseCase.execute({
        user_id: "asdhu12gyg3-dasdsdabsd",
        statement_id: "asdhu12gyg3-dasdsdabsd",
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });
  it("should throw an error when the statement is not found", () => {
    expect(async ()=>{
      const userCreated = await usersRepositoryInMemory.create(user)
      await getStatementOperationUseCase.execute({
        user_id: userCreated.id as string,
        statement_id: "asdhu12gyg3-dasdsdabsd",
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });
});
