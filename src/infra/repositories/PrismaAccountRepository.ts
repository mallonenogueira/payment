import { Account } from "@/domain/entities/Account";
import { AccountRepository } from "@/application/repositories/AccountRepository";
import { Transaction } from "@/application/transaction/Transaction";
import { PrismaContext } from "../transaction/PrismaTransactionManager";

export class PrismaAccountRepository implements AccountRepository {
  constructor(private prisma: PrismaContext) {}

  with(transaction: Transaction<PrismaContext>) {
    return new PrismaAccountRepository(transaction.getContext());
  }

  async create(account: Account): Promise<void> {
    await this.prisma.account.create({
      data: account,
    });
  }

  async findAll(): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany();
    return accounts.map(
      (prismaAccount) =>
        new Account(
          prismaAccount.id,
          prismaAccount.document,
          prismaAccount.name,
          prismaAccount.email
        )
    );
  }

  async findById(id: string): Promise<Account | null> {
    const prismaAccount = await this.prisma.account.findUnique({
      where: {
        id: id,
      },
    });

    if (!prismaAccount) return null;

    return new Account(
      prismaAccount.id,
      prismaAccount.document,
      prismaAccount.name,
      prismaAccount.email
    );
  }
}
