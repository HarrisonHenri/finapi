import { AppError } from "../../../../shared/errors/AppError";

export namespace MakeTransferError {
  export class SenderEqualsReceiverUser extends AppError {
    constructor() {
      super('Sender equals receiver', 400);
    }
  }

  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 400);
    }
  }

  export class NoFunds extends AppError {
    constructor() {
      super('User not found', 400);
    }
  }
}
