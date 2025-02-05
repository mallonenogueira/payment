import { Company } from "@/domain/entities/Company";
import { CompanyRepository } from "@/application/repositories/CompanyRepository";
import { PrismaContext } from "../transaction/PrismaTransactionManager";
import { Transaction } from "@/application/transaction/Transaction";

export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private prisma: PrismaContext) {}

  with(transaction: Transaction<PrismaContext>) {
    return new PrismaCompanyRepository(transaction.getContext());
  }

  async create(company: Company): Promise<void> {
    await this.prisma.company.create({
      data: company,
    });
  }

  async update(company: Company): Promise<void> {
    await this.prisma.company.update({
      where: {
        id: company.id,
        accountId: company.accountId,
      },
      data: company,
    });
  }

  async findById(id: string): Promise<Company | null> {
    const prismaCompany = await this.prisma.company.findUnique({
      where: {
        id: id,
      },
    });

    if (!prismaCompany) return null;

    return new Company(
      prismaCompany.id,
      prismaCompany.accountId,
      prismaCompany.name,
      prismaCompany.active
    );
  }

  async findByAccountId(accountId: string): Promise<Company[]> {
    const prismaCompanies = await this.prisma.company.findMany({
      where: {
        accountId,
      },
    });

    return prismaCompanies.map(
      (prismaCompany) =>
        new Company(
          prismaCompany.id,
          prismaCompany.accountId,
          prismaCompany.name,
          prismaCompany.active
        )
    );
  }

  async addUsers(company: Company, users: { id: string }[]): Promise<void> {
    await this.prisma.company.update({
      where: {
        id: company.id,
        accountId: company.accountId,
      },
      data: {
        users: {
          connect: users.map((user) => ({
            id: user.id,
            accountId: company.accountId,
          })),
        },
      },
    });
  }

  async removeUsers(company: Company, users: { id: string }[]): Promise<void> {
    await this.prisma.company.update({
      where: {
        id: company.id,
        accountId: company.accountId,
      },
      data: {
        users: {
          disconnect: users.map((user) => ({ id: user.id })),
        },
      },
    });
  }
}
