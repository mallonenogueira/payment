import jwt from "jsonwebtoken";
import { UserRole } from "@/domain/entities/User";
import { env } from "@/infra/configuration/env";

export class GenerateJwtPayloadUseCase {
  constructor() {}

  async execute(input: AuthInput): Promise<AuthOutput> {
    return {
      payload: input,
      token: jwt.sign(input, env.jwtSecret),
    }
  }
}

export interface AuthInput {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accountId: string;
  companies: {
    id: string;
    name: string;
  }[];
}

export interface AuthOutput {
  payload: AuthInput;
  token: string;
}
