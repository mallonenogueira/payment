import { UserRepository } from "../../repositories/UserRepository";
import { User, UserRole } from "@/domain/entities/User";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: UserInput): Promise<UserOutput> {
    const user = new User(
      input.id,
      input.name,
      input.email,
      input.role,
      input.accountId
    );

    await this.userRepository.update(user);

    return {
      id: user.id,
      accountId: user.accountId,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

export interface UserInput {
  readonly id: string;
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
