import { Request, Response } from "express";
import { container } from "tsyringe";

import { MakeTransferUseCase } from "./MakeTransferUseCase";

class MakeTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { amount, description } = request.body;
    const { id: sender_id } = request.user;
    const { user_id: receiver_id } = request.params;

    const makeTransferUseCase = container.resolve(MakeTransferUseCase);
    await makeTransferUseCase.execute({
      sender_id,
      receiver_id,
      amount,
      description,
    });

    return response.status(201).send();
  }
}

export { MakeTransferController };
