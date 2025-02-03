import { prisma } from "./PrismaClient";
import { SubscriptionRepository } from "@/application/repositories/SubscriptionRepository";
import { Subscription, SubscriptionStatus } from "@/domain/entities/Subscription";

const mapStatus = {
  CREATED: SubscriptionStatus.CREATED,
  PENDING: SubscriptionStatus.PENDING,
  APPROVED: SubscriptionStatus.APPROVED,
  CANCELED: SubscriptionStatus.CANCELED,
  EXPIRED: SubscriptionStatus.EXPIRED,
};

export class PrismaSubscriptionRepository implements SubscriptionRepository {
  async findById(id: string): Promise<Subscription | null> {
    const subs = await prisma.subscription.findUnique({
      where: {
        id,
      },
    });

    if (!subs) return null;

    return new Subscription(
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

  async findByAccountId(accountId: string): Promise<Subscription[]> {
    const subs = await prisma.subscription.findMany({
      where: {
        accountId,
      },
    });

    return subs.map(
      (sub) =>
        new Subscription(
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

  async create(subscription: Subscription): Promise<void> {
    await prisma.subscription.create({
      data: {
        ...subscription,
      },
    });
  }

  async update(subscription: Subscription): Promise<void> {
    await prisma.subscription.update({
      data: {
        ...subscription,
      },
      where: {
        id: subscription.id,
      },
    });
  }
}
