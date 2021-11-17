import { hash } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { sign, verify } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { JWTInvalidTokenError } from "../../../errors/JWTInvalidTokenError";
import { JWTTokenMissingError } from "../../../errors/JWTTokenMissingError";
import { admin } from "../../../providers/Firebase";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new JWTTokenMissingError()
  }

  const [, token] = authHeader.split(" ");

  if (request.headers['x-auth'] === "firebase"){
    const decodeValue = await admin.auth().verifyIdToken(token);

    const usersRepository = new UsersRepository()

    const userAlreadyExists = await usersRepository.findByEmail(decodeValue.email as string);

    if (userAlreadyExists) {
      request.user = {
        id: userAlreadyExists.id as string,
      };
    }
    else {
      const passwordHash = await hash(String(Math.random() * 100000000000), 8);

      const user = await usersRepository.create({
        email: decodeValue.email as string,
        name: decodeValue.name as string,
        password: passwordHash,
      });

      request.user = {
        id: user.id as string,
      };
    }

    next();
  }
  else {
    try {
      const { sub: user_id } = verify(token, authConfig.jwt.secret) as IPayload;

      request.user = {
        id: user_id,
      };

      next();
    } catch {
      throw new JWTInvalidTokenError()
    }
  }
}
