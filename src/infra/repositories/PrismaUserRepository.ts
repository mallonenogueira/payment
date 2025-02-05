import { User, UserRole } from "@/domain/entities/User";
import { UserRepository } from "@/application/repositories/UserRepository";
import { Transaction } from "@/application/transaction/Transaction";
import { PrismaContext } from "../transaction/PrismaTransactionManager";
import { EntityMissingParams } from "@/domain/errors/EntityMissingParams";
import { UserRole as PrismaUserRole, User as PrismaUser } from "@prisma/client";

const mapRole = {
  [PrismaUserRole.ADMIN]: UserRole.ADMIN,
  [PrismaUserRole.USER]: UserRole.USER,
};

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaContext) {}

  with(transaction: Transaction<PrismaContext>) {
    return new PrismaUserRepository(transaction.getContext());
  }

  async create(user: User): Promise<void> {
    if (!user.password) throw new EntityMissingParams(["password"]);

    await this.prisma.user.create({
      data: {
        ...user,
        password: user.password,
      },
    });
  }

  async update({ password, ...user }: User): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id,
        accountId: user.accountId,
      },
      data: {
        ...user,
      },
    });
  }

  async findById(id: string, accountId?: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        accountId,
        id,
      },
    });
    if (!user) return null;

    return this.mapToUser(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      mapRole[user.role],
      user.accountId,
      user.createdAt,
      user.password
    );
  }

  async findByCompanyId(
    companyId: string,
    accountId?: string
  ): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        accountId,
        companies: {
          some: {
            id: companyId,
          },
        },
      },
    });

    return users.map(this.mapToUser);
  }

  async findByAccountId(accountId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        accountId,
      },
    });

    return users.map(this.mapToUser);
  }

  private mapToUser(user: PrismaUser) {
    return new User(
      user.id,
      user.name,
      user.email,
      mapRole[user.role],
      user.accountId,
      user.createdAt
    );
  }
}
