import { Ceremony } from "@/domain/entities/ceremony/Ceremony";
import { CeremonyRepository } from "@/application/repositories/CeremonyRepository";
import { Transaction } from "@/application/transaction/Transaction";
import { PrismaContext } from "../transaction/PrismaTransactionManager";

export class PrismaCeremonyRepository implements CeremonyRepository {
  constructor(private prisma: PrismaContext) {}

  with(transaction: Transaction): CeremonyRepository {
    return new PrismaCeremonyRepository(transaction.getContext());
  }

  async create(ceremony: Ceremony): Promise<void> {
    await this.prisma.ceremony.create({
      data: ceremony,
    });
  }

  async update(ceremony: Ceremony): Promise<void> {
    await this.prisma.ceremony.create({
      data: ceremony,
    });
  }

  async findById(id: string, accountId?: string): Promise<Ceremony | null> {
    const prismaCeremony = await this.prisma.ceremony.findUnique({
      where: {
        id,
        accountId,
      },
    });

    if (!prismaCeremony) return null;

    return Ceremony.restore(
      prismaCeremony.id,
      prismaCeremony.accountId,
      prismaCeremony.companyId,
      prismaCeremony.published,
      prismaCeremony.createdAt,
      prismaCeremony.updatedAt,
      prismaCeremony.startDate ?? undefined,
      prismaCeremony.endDate ?? undefined,
      prismaCeremony.tributeDate ?? undefined,
      prismaCeremony.description ?? undefined,
      prismaCeremony.publicId
    );
  }

  async findByCompanyId(
    companyId: string,
    accountId?: string
  ): Promise<Ceremony[]> {
    const ceremonies = await this.prisma.ceremony.findMany({
      where: {
        companyId,
        accountId,
      },
    });

    return ceremonies.map((prismaCeremony) =>
      Ceremony.restore(
        prismaCeremony.id,
        prismaCeremony.accountId,
        prismaCeremony.companyId,
        prismaCeremony.published,
        prismaCeremony.createdAt,
        prismaCeremony.updatedAt,
        prismaCeremony.startDate ?? undefined,
        prismaCeremony.endDate ?? undefined,
        prismaCeremony.tributeDate ?? undefined,
        prismaCeremony.description ?? undefined,
        prismaCeremony.publicId
      )
    );
  }
}
