import { Id } from "../../value-objects/Id";

export class Ceremony {
  private constructor(
    readonly id: string,
    readonly accountId: string,
    readonly companyId: string,
    readonly published: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly start?: Date,
    readonly end?: Date,
    readonly tribute?: Date,
    readonly description?: string,
    readonly publicId?: number
  ) {}

  static create(
    accountId: string,
    companyId: string,
    published: boolean,
    startDate?: Date,
    endDate?: Date,
    tributeDate?: Date,
    description?: string
  ) {
    const now = new Date();

    return new Ceremony(
      Id.createString(),
      accountId,
      companyId,
      published,
      now,
      now,
      startDate,
      endDate,
      tributeDate,
      description
    );
  }

  static restore(
    id: string,
    accountId: string,
    companyId: string,
    published: boolean,
    createdAt: Date,
    updatedAt: Date,
    startDate?: Date,
    endDate?: Date,
    tributeDate?: Date,
    description?: string,
    publicId?: number
  ) {
    return new Ceremony(
      id,
      accountId,
      companyId,
      published,
      createdAt,
      updatedAt,
      startDate,
      endDate,
      tributeDate,
      description,
      publicId
    );
  }
}
