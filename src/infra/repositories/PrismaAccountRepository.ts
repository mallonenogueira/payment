import { Account } from "@/domain/entities/Account";
import { AccountRepository } from "@/application/repositories/AccountRepository";
import { prisma } from "./PrismaClient";

export class PrismaAccountRepository implements AccountRepository {
  async create(account: Account): Promise<void> {
    await prisma.account.create({
      data: account,
    });
  }

  async findAll(): Promise<Account[]> {
    const accounts = await prisma.account.findMany();
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
    const prismaAccount = await prisma.account.findUnique({
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
