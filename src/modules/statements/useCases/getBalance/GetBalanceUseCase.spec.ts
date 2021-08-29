import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
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
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });
  it("should be able to get the user balance", async () => {
    const userCreated = await usersRepositoryInMemory.create(user)
    const statement = {
      type: OperationType.DEPOSIT,
      amount:10,
      description:'Description',
      user_id: userCreated.id as string
    }

    await statementsRepositoryInMemory.create(statement);
    const balance = await getBalanceUseCase.execute({user_id:userCreated.id as string})

    expect(balance.balance).toBe(statement.amount)
  });
  it("should not be able to get the user balance when the user is not found", () => {
    expect(async ()=>{
      await getBalanceUseCase.execute({user_id: "asdhu12gyg3-dasdsdabsd"})
    }).rejects.toBeInstanceOf(GetBalanceError)
  });
});
