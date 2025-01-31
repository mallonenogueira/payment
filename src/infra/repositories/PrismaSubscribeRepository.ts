import { prisma } from "./PrismaClient";
import { SubscribeRepository } from "@/application/repositories/SubscribeRepository";
import { Subscribe } from "@/domain/entities/Subscribe";

export class PrismaSubscribeRepository implements SubscribeRepository {
  async create(subscribe: Subscribe): Promise<void> {
    await prisma.subscribe.create({
      data: subscribe,
    });
  }
}
