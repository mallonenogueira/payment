import { EntityMissingParams } from "../errors/EntityMissingParams";
import { Id } from "../value-objects/Id";
import { ProductType } from "./Product";

export enum SubscriptionStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}

export class Subscription {
  constructor(
    readonly id: string,
    readonly price: number,
    public status: SubscriptionStatus,
    readonly accountId: string,
    readonly productId: string,
    readonly createdAt: Date,
    public updatedAt: Date,
    public expiredAt?: Date
  ) {}

  static create(price: number, accountId: string, productId: string) {
    if (!price || !accountId || !productId) {
      throw new EntityMissingParams(["price", "accountId", "productId"]);
    }

    const now = new Date();
    const createdAt = now;
    const updatedAt = now;

    return new Subscription(
      Id.createString(),
      price,
      SubscriptionStatus.CREATED,
      accountId,
      productId,
      createdAt,
      updatedAt
    );
  }

  approve(productType?: ProductType) {
    switch (this.status) {
      case SubscriptionStatus.APPROVED:
        throw new Error("Subscription already approved.");
      case SubscriptionStatus.CANCELED:
      case SubscriptionStatus.EXPIRED:
        throw new Error("Subscription can not be approved.");
      default:
        this.updatedAt = new Date();
        this.status = SubscriptionStatus.APPROVED;
        this.expiredAt = this.getExpirationDate(productType);
    }
  }

  private getExpirationDate(productType?: ProductType): Date | undefined {
    if (!productType) return;

    const date = new Date();

    if (productType === ProductType.MONTH) {
      date.setMonth(date.getMonth() + 1);
    }

    if (productType === ProductType.YEAR) {
      date.setFullYear(date.getFullYear() + 1);
    }

    return date;
  }
}
