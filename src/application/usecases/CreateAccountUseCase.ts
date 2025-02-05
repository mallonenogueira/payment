import { Account } from "@/domain/entities/Account";
import { AccountRepository } from "../repositories/AccountRepository";
import { MailService } from "../services/MailService";
import { CompanyRepository } from "../repositories/CompanyRepository";
import { Company } from "@/domain/entities/Company";
import { TransactionManager } from "../transaction/TransactionManager";
import { User, UserRole } from "@/domain/entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class CreateAccountUseCase {
  constructor(
    private transactionManager: TransactionManager,
    private accountRepository: AccountRepository,
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository,
    private mailService: MailService
  ) {}

  async execute(input: AccountInput): Promise<AccountOutput> {
    const account = Account.create(input.document, input.name, input.email);
    const company = Company.create(input.name, account.id);
    const user = User.create(
      "Administrador",
      input.email,
      UserRole.ADMIN,
      account.id
    );
    const transaction = await this.transactionManager.create();

    await transaction.execute(async () => {
      await this.accountRepository.with(transaction).create(account);
      await this.companyRepository.with(transaction).create(company);
      await this.userRepository.with(transaction).create(user);
      await this.companyRepository.with(transaction).addUsers(company, [user]);
    });

    try {
      await this.mailService.send({
        fromName: "noreply",
        fromEmail: "noreply@desenv.mallone.dev",
        subject: "Bem-vindo a Application",
        to: input.email,
        body: `<h1>${input.name} que bom ter você conosco! :D</h1> Desenvolvimento Teste!`,
      });
    } catch (error) {
      console.error("Teste API email: Error", error);
    }

    return {
      account: {
        id: account.id,
        name: account.name,
        email: account.email,
        document: account.document,
      },
      company: {
        id: company.id,
        name: company.name,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

export interface AccountInput {
  readonly document: string;
  readonly name: string;
  readonly email: string;
}

export interface AccountOutput {
  readonly account: {
    readonly id: string;
    readonly document: string;
    readonly name: string;
    readonly email: string;
  };
  readonly company: {
    readonly id: string;
    readonly name: string;
  };
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
  };
}
