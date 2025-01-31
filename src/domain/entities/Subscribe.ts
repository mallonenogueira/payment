import { EntityMissingParams } from "../errors/EntityMissingParams";
import { Id } from "../value-objects/Id";

enum SubscribeStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}

export class Subscribe {
  constructor(
    readonly id: string,
    readonly price: number,
    readonly status: SubscribeStatus,
    readonly accountId: string,
    readonly productId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly expiredAt: Date
  ) {}

  static create(
    price: number,
    accountId: string,
    productId: string,
    expiredAt: Date
  ) {
    if (!price || !accountId || !productId || !expiredAt) {
      throw new EntityMissingParams([
        "price",
        "accountId",
        "productId",
        "expiredAt",
      ]);
    }

    const now = new Date();
    const createdAt = now;
    const updatedAt = now;

    //TODO: validar data de expiração maior que now

    return new Subscribe(
      Id.createString(),
      price,
      SubscribeStatus.CREATED,
      accountId,
      productId,
      createdAt,
      updatedAt,
      expiredAt
    );
  }
}
