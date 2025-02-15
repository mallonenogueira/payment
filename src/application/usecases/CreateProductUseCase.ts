import { ProductRepository } from "../repositories/ProductRepository";
import { Product, ProductType } from "@/domain/entities/payment/Product";

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: ProductInput): Promise<ProductOutput> {
    const product = Product.create(
      input.title,
      input.description,
      input.price,
      input.type,
      input.installments,
      input.active
    );

    await this.productRepository.create(product);

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      type: product.type,
      installments: product.installments,
      active: product.active,
    };
  }
}

export interface ProductInput {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly type: ProductType;
  readonly installments?: number;
  readonly active?: boolean;
}

export interface ProductOutput {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly type: ProductType;
  readonly installments: number;
  readonly active: boolean;
}
