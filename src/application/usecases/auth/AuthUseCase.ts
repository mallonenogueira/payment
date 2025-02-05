import { UserRepository } from "../../repositories/UserRepository";
import { Password } from "@/domain/value-objects/Password";
import { UserRole } from "@/domain/entities/User";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";

export class AuthUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: AuthInput): Promise<AuthOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (
      !user ||
      !user.password ||
      !Password.compare(input.password, user.password)
    ) {
      throw new UnauthorizedError("Usuário ou senha inválido.");
    }

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      accountId: user.accountId,
    };
  }
}

export interface AuthInput {
  email: string;
  password: string;
}

export interface AuthOutput {
  name: string;
  email: string;
  role: UserRole;
  accountId: string;
}
