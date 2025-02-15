import { HonoredPerson } from "@/domain/entities/ceremony/HonoredPerson";
import { HonoredPersonRepository } from "@/application/repositories/HonoredPersonRepository";
import { Transaction } from "@/application/transaction/Transaction";
import { PrismaContext } from "../transaction/PrismaTransactionManager";

export class PrismaHonoredPersonRepository implements HonoredPersonRepository {
  constructor(private prisma: PrismaContext) {}

  with(transaction: Transaction): HonoredPersonRepository {
    return new PrismaHonoredPersonRepository(transaction.getContext());
  }

  async create(honoredPerson: HonoredPerson): Promise<void> {
    await this.prisma.honoredPerson.create({
      data: honoredPerson,
    });
  }

  async update(honoredPerson: HonoredPerson): Promise<void> {
    await this.prisma.honoredPerson.create({
      data: honoredPerson,
    });
  }

  async findById(
    id: string,
    accountId?: string
  ): Promise<HonoredPerson | null> {
    const prismaHonoredPerson = await this.prisma.honoredPerson.findUnique({
      where: {
        id,
        accountId,
      },
    });

    if (!prismaHonoredPerson) return null;

    return HonoredPerson.restore(
      prismaHonoredPerson.id,
      prismaHonoredPerson.accountId,
      prismaHonoredPerson.ceremonyId,
      prismaHonoredPerson.name,
      prismaHonoredPerson.createdAt,
      prismaHonoredPerson.updatedAt,
      prismaHonoredPerson.history ?? undefined,
      prismaHonoredPerson.birthDate ?? undefined,
      prismaHonoredPerson.deathDate ?? undefined,
      prismaHonoredPerson.imageId ?? undefined
    );
  }

  async findByCeremonyId(
    ceremonyId: string,
    accountId?: string
  ): Promise<HonoredPerson[]> {
    const persons = await this.prisma.honoredPerson.findMany({
      where: {
        ceremonyId,
        accountId,
      },
    });

    return persons.map((prismaHonoredPerson) =>
      HonoredPerson.restore(
        prismaHonoredPerson.id,
        prismaHonoredPerson.accountId,
        prismaHonoredPerson.ceremonyId,
        prismaHonoredPerson.name,
        prismaHonoredPerson.createdAt,
        prismaHonoredPerson.updatedAt,
        prismaHonoredPerson.history ?? undefined,
        prismaHonoredPerson.birthDate ?? undefined,
        prismaHonoredPerson.deathDate ?? undefined,
        prismaHonoredPerson.imageId ?? undefined
      )
    );
  }
}
