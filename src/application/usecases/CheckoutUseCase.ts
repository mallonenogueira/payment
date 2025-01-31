import { SubscribeStatus } from "@prisma/client";
import { SubscribeRepository } from "../repositories/SubscribeRepository";
import { Subscribe } from "@/domain/entities/Subscribe";

export class CreateSubscribeUseCase {
  constructor(private subscribeRepository: SubscribeRepository) {}

  async execute(input: SubscribeInput): Promise<SubscribeOutput> {
    const subscribe = Subscribe.create(
      input.price,
      input.accountId,
      input.productId,
      input.expiredAt
    );

    await this.subscribeRepository.create(subscribe);

    return {
      id: subscribe.id,
      price: subscribe.price,
      accountId: subscribe.accountId,
      productId: subscribe.productId,
      expiredAt: subscribe.expiredAt,
      status: subscribe.status,
    };
  }
}

export interface SubscribeInput {
  readonly price: number;
  readonly accountId: string;
  readonly productId: string;
  readonly expiredAt: Date;
}

export interface SubscribeOutput {
  readonly id: string;
  readonly price: number;
  readonly accountId: string;
  readonly productId: string;
  readonly expiredAt: Date;
  readonly status: SubscribeStatus;
}
