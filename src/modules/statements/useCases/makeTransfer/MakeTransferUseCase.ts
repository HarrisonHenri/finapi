import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { MakeTransferError } from "./MakeTransferError";

interface IRequest {
  sender_id: string;
  receiver_id: string;
  amount: number;
  description: string;
}

@injectable()
class MakeTransferUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    sender_id,
    receiver_id,
    amount,
    description,
  }: IRequest): Promise<void> {
    if (sender_id === receiver_id) {
      throw new MakeTransferError.SenderEqualsReceiverUser();
    }

    const receiver = await this.usersRepository.findById(receiver_id);
    if (!receiver) {
      throw new MakeTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });
    if (balance < amount) {
      throw new MakeTransferError.NoFunds();
    }

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: receiver_id,
    });

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: sender_id,
    });
  }
}

export {MakeTransferUseCase}
