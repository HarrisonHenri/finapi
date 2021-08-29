import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usesRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    usesRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usesRepositoryInMemory);
  });
  it("should be able to create a new user", async () => {
    const user = {
      name: "User name",
      password: "123456",
      email: "user@email.com"
    };

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty("id");
    expect(userCreated.email).toBe(user.email);
  });
  it("should not be able to create an user that already exists", () => {
    expect(async () => {
      const user = {
        name: "User name",
        password: "123456",
        email: "user@email.com",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
