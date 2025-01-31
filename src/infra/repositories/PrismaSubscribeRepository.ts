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
      subs.expiredAt
    );
  }

  async create(subscribe: Subscribe): Promise<void> {
    await prisma.subscribe.create({
      data: subscribe,
    });
  }
}
