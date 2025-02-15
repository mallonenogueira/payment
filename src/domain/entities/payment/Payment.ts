import { EntityMissingParams } from "../../errors/EntityMissingParams";
import { Id } from "../../value-objects/Id";

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELED = "CANCELED",
}

export class Payment {
  constructor(
    readonly id: string,
    readonly price: number,
    readonly installments: number,
    readonly status: PaymentStatus,
    readonly accountId: string,
    readonly subscriptionId: string,
    readonly createdAt: Date,
    readonly updatedAt?: Date,
    readonly approvedAt?: Date,
    readonly gateway?: string,
    readonly gatewayId?: string
  ) {}

  static create(
    price: number,
    installments: number,
    status: PaymentStatus,
    accountId: string,
    subscriptionId: string,
    createdAt: Date,
    updatedAt?: Date,
    approvedAt?: Date,
    gateway?: string,
    gatewayId?: string
  ) {
    if (
      !price ||
      !installments ||
      !status ||
      !accountId ||
      !subscriptionId ||
      !createdAt
    ) {
      throw new EntityMissingParams([
        "price",
        "installments",
        "status",
        "accountId",
        "subscriptionId",
        "createdAt",
      ]);
    }

    return new Payment(
      Id.createString(),
      price,
      installments,
      status,
      accountId,
      subscriptionId,
      createdAt,
      updatedAt,
      approvedAt,
      gateway,
      gatewayId
    );
  }
}
