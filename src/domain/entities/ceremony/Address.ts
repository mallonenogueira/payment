import { EntityMissingParams } from "@/domain/errors/EntityMissingParams";
import { Id } from "../../value-objects/Id";

export class Address {
  constructor(
    readonly id: string,
    readonly accountId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly zipCode: string,
    readonly name: string,
    readonly address: string,
    readonly number: string,
    readonly city: string,
    readonly state: string,
    readonly complement?: string
  ) {}

  static create(
    accountId: string,
    zipCode: string,
    name: string,
    address: string,
    number: string,
    city: string,
    state: string,
    complement?: string
  ) {
    if (
      !accountId ||
      !zipCode ||
      !name ||
      !address ||
      !number ||
      !city ||
      !state
    ) {
      throw new EntityMissingParams([
        "  accountId",
        "zipCode",
        "name",
        "address",
        "number",
        "city",
        "state",
      ]);
    }

    const now = new Date();

    return new Address(
      Id.createString(),
      accountId,
      now,
      now,
      zipCode,
      name,
      address,
      number,
      city,
      state,
      complement
    );
  }

  static restore(
    id: string,
    accountId: string,
    createdAt: Date,
    updatedAt: Date,
    zipCode: string,
    name: string,
    address: string,
    number: string,
    city: string,
    state: string,
    complement?: string
  ) {
    return new Address(
      id,
      accountId,
      createdAt,
      updatedAt,
      zipCode,
      name,
      address,
      number,
      city,
      state,
      complement
    );
  }
}
