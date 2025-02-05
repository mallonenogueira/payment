import jwt from "jsonwebtoken";
import { UserRole } from "@/domain/entities/User";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { env } from "@/infra/configuration/env";
import { ForbiddenError } from "@/domain/errors/ForbiddenError";

export class DecodeJwtPayloadUseCase {
  constructor() {}

  async execute(token: string): Promise<AuthOutput> {
    if (!token || !token.startsWith("Bearer ")) {
      throw new UnauthorizedError("Unauthorized.");
    }

    return new Promise((resolve, reject) => {
      jwt.verify(
        token.replace("Bearer ", ""),
        env.jwtSecret,
        (err, decoded) => {
          if (err) {
            return reject(new ForbiddenError("Invalid token."));
          }

          resolve(decoded as AuthOutput);
        }
      );
    });
  }
}

export interface AuthOutput {
  email: string;
  name: string;
  role: UserRole;
  accountId: string;
}
