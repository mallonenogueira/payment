import { prisma } from "./PrismaClient";
import { SubscribeRepository } from "@/application/repositories/SubscribeRepository";
import { Subscribe, SubscribeStatus } from "@/domain/entities/Subscribe";

const mapStatus = {
  CREATED: SubscribeStatus.CREATED,
  PENDING: SubscribeStatus.PENDING,
  APPROVED: SubscribeStatus.APPROVED,
  CANCELED: SubscribeStatus.CANCELED,
  EXPIRED: SubscribeStatus.EXPIRED,
};

export class PrismaSubscribeRepository implements SubscribeRepository {
  async findById(id: string): Promise<Subscribe | null> {
    const subs = await prisma.subscribe.findUnique({
      where: {
        id,
      },
    });

    if (!subs) return null;

    return new Subscribe(
      subs.id,
      subs.price,
      mapStatus[subs.status],
      subs.accountId,
      subs.productId,
      subs.createdAt,
      subs.updatedAt,
      subs.expiredAt ?? undefined
    );
  }

  async findByAccountId(accountId: string): Promise<Subscribe[]> {
    const subs = await prisma.subscribe.findMany({
      where: {
        accountId,
      },
    });

    return subs.map(
      (sub) =>
        new Subscribe(
          sub.id,
          sub.price,
          mapStatus[sub.status],
          sub.accountId,
          sub.productId,
          sub.createdAt,
          sub.updatedAt,
          sub.expiredAt ?? undefined
        )
    );
  }

  async create(subscribe: Subscribe): Promise<void> {
    await prisma.subscribe.create({
      data: {
        ...subscribe,
      },
    });
  }

  async update(subscribe: Subscribe): Promise<void> {
    await prisma.subscribe.update({
      data: {
        ...subscribe,
      },
      where: {
        id: subscribe.id,
      },
    });
  }
}
