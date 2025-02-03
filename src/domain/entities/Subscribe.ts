import { EntityMissingParams } from "../errors/EntityMissingParams";
import { Id } from "../value-objects/Id";
import { ProductType } from "./Product";

export enum SubscribeStatus {
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
    public status: SubscribeStatus,
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

    return new Subscribe(
      Id.createString(),
      price,
      SubscribeStatus.CREATED,
      accountId,
      productId,
      createdAt,
      updatedAt
    );
  }

  approve(productType?: ProductType) {
    switch (this.status) {
      case SubscribeStatus.APPROVED:
        throw new Error("Subscribe already approved.");
      case SubscribeStatus.CANCELED:
      case SubscribeStatus.EXPIRED:
        throw new Error("Subscribe can not be approved.");
      default:
        this.updatedAt = new Date();
        this.status = SubscribeStatus.APPROVED;
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
