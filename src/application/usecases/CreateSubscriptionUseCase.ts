import { SubscriptionStatus } from "@prisma/client";
import { Subscription } from "@/domain/entities/payment/Subscription";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { ValidationError } from "@/domain/errors/ValidationError";

export class CreateSubscriptionUseCase {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private productRepository: ProductRepository
  ) {}

  async execute(input: SubscriptionInput): Promise<SubscriptionOutput> {
    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new ValidationError("Produto não encontrado.");
    }

    if (!product.active) {
      throw new ValidationError("Produto não se encontra mais ativo.");
    }

    const subscription = Subscription.create(
      product.price,
      input.accountId,
      product.id,
    );

    await this.subscriptionRepository.create(subscription);

    return {
      id: subscription.id,
      price: subscription.price,
      accountId: subscription.accountId,
      productId: subscription.productId,
      status: subscription.status,
    };
  }
}

export interface SubscriptionInput {
  readonly accountId: string;
  readonly productId: string;
}

export interface SubscriptionOutput {
  readonly id: string;
  readonly price: number;
  readonly accountId: string;
  readonly productId: string;
  readonly status: SubscriptionStatus;
}
