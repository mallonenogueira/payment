import { EntityMissingParams } from "../../errors/EntityMissingParams";
import { Id } from "../../value-objects/Id";

export enum ProductType {
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export class Product {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly price: number,
    readonly installments: number,
    readonly type: ProductType,
    readonly active: boolean
  ) {}

  static create(
    title: string,
    description: string,
    price: number,
    type: ProductType,
    installments?: number,
    active?: boolean
  ) {
    if (!title || !description || !price || !type) {
      throw new EntityMissingParams([
        "title",
        "description",
        "price",
        "type",
      ]);
    }

    return new Product(
      Id.createString(),
      title,
      description,
      price,
      installments ?? 1,
      type,
      active ?? true
    );
  }
}
