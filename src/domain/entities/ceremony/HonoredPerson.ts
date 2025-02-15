import { EntityMissingParams } from "../../errors/EntityMissingParams";
import { Id } from "../../value-objects/Id";

export class HonoredPerson {
  constructor(
    readonly id: string,
    readonly accountId: string,
    readonly ceremonyId: string,
    readonly name: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly history?: string,
    readonly birthDate?: Date,
    readonly deathDate?: Date,
    readonly imageId?: string,
  ) {}

  static create(
    accountId: string,
    ceremonyId: string,
    name: string,
    history?: string,
    birthDate?: Date,
    deathDate?: Date,
  ) {
    if (!name || !ceremonyId) {
      throw new EntityMissingParams(["name", "ceremonyId"]);
    }

    const now = new Date();

    return new HonoredPerson(
      Id.createString(),
      accountId,
      ceremonyId,
      name,
      now,
      now,
      history,
      birthDate,
      deathDate
    );
  }

  static restore(
    id: string,
    accountId: string,
    ceremonyId: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    history?: string,
    birthDate?: Date,
    deathDate?: Date,
    imageId?: string,
  ) {
    return new HonoredPerson(
      id,
      accountId,
      ceremonyId,
      name,
      createdAt,
      updatedAt,
      history,
      birthDate,
      deathDate,
      imageId,
    );
  }
}
