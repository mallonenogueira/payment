import { SubscribeStatus } from "@prisma/client";
import { Subscribe } from "@/domain/entities/Subscribe";
import { SubscribeRepository } from "../repositories/SubscribeRepository";
import { ProductRepository } from "../repositories/ProductRepository";

export class CreateSubscribeUseCase {
  constructor(
    private subscribeRepository: SubscribeRepository,
    private productRepository: ProductRepository
  ) {}

  async execute(input: SubscribeInput): Promise<SubscribeOutput> {
    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    if (!product.active) {
      throw new Error("Produto não se encontra mais ativo.");
    }

    const subscribe = Subscribe.create(
      product.price,
      input.accountId,
      product.id,
    );

    await this.subscribeRepository.create(subscribe);

    return {
      id: subscribe.id,
      price: subscribe.price,
      accountId: subscribe.accountId,
      productId: subscribe.productId,
      status: subscribe.status,
    };
  }
}

export interface SubscribeInput {
  readonly accountId: string;
  readonly productId: string;
}

export interface SubscribeOutput {
  readonly id: string;
  readonly price: number;
  readonly accountId: string;
  readonly productId: string;
  readonly status: SubscribeStatus;
}
