import { Account } from "@/domain/entities/Account";
import { AccountRepository } from "../repositories/AccountRepository";

export class CreateAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute(input: AccountInput): Promise<AccountOutput> {
    const account = Account.create(input.document, input.name, input.email);

    await this.accountRepository.create(account);

    return {
      id: account.id,
      name: account.name,
      document: account.document,
      email: account.email,
    };
  }
}

export interface AccountInput {
  readonly document: string;
  readonly name: string;
  readonly email: string;
}

export interface AccountOutput {
  readonly id: string;
  readonly document: string;
  readonly name: string;
  readonly email: string;
}
