import { UserRepository } from "../../repositories/UserRepository";
import { User, UserRole } from "@/domain/entities/User";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: UserInput): Promise<UserOutput> {
    const user = User.create(
      input.name,
      input.email,
      input.role,
      input.accountId
    );

    await this.userRepository.create(user);

    return {
      id: user.id,
      accountId: user.accountId,
      role: user.role,
      email: user.email,
      name: user.name,
    };
  }
}

export interface UserInput {
  readonly accountId: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
}

export interface UserOutput {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
}
