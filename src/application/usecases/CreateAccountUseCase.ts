import { Account } from "@/domain/entities/Account";
import { AccountRepository } from "../repositories/AccountRepository";
import { MailService } from "../services/MailService";

export class CreateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private mailService: MailService
  ) {}

  async execute(input: AccountInput): Promise<AccountOutput> {
    const account = Account.create(input.document, input.name, input.email);

    await this.accountRepository.create(account);

    try {
      await this.mailService.send({
        fromName: 'noreply',
        fromEmail: 'noreply@desenv.mallone.dev',
        subject: 'Bem-vindo a Application',
        to: input.email,
        body: `<h1>${input.name} que bom ter vocês conosco! :D</h1> Desenvolvimento Teste!`,
      });
    } catch (error) {
      console.error("Teste API email: Error", error);
    }

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
