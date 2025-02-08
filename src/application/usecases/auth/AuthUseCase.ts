import { UserRepository } from "../../repositories/UserRepository";
import { Password } from "@/domain/value-objects/Password";
import { UserRole } from "@/domain/entities/User";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { CompanyRepository } from "@/application/repositories/CompanyRepository";

export class AuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private companyRepository: CompanyRepository
  ) {}

  async execute(input: AuthInput): Promise<AuthOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (
      !user ||
      !user.password ||
      !Password.compare(input.password, user.password)
    ) {
      throw new UnauthorizedError("Usuário ou senha inválido.");
    }

    const companies = await this.companyRepository.findActiveByUserId(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountId: user.accountId,
      companies: companies.map((company) => ({
        name: company.name,
        id: company.id,
      })),
    };
  }
}

export interface AuthInput {
  email: string;
  password: string;
}

export interface AuthOutput {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountId: string;
  companies: {
    id: string;
    name: string;
  }[];
}
