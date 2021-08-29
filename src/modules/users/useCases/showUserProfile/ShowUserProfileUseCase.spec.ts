import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
const user = {
  name: "Name",
  email: "Email",
  password: "Password"
};

describe("Get Balances", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });
  it("should be able to get the user profile", async () => {
    const userCreated = await usersRepositoryInMemory.create(user)

    const profile = await showUserProfileUseCase.execute(userCreated.id as string)
    expect(profile.id).toBe(userCreated.id);
  });
  it("should not be able to get the user profile when the user is not found", async () => {
    expect(async ()=>{
      await showUserProfileUseCase.execute("asdasdhu-dasdsad")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  });
});
