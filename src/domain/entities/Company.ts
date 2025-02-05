import { EntityMissingParams } from "../errors/EntityMissingParams";
import { Id } from "../value-objects/Id";

export class Company {
  constructor(
    readonly id: string,
    readonly accountId: string,
    readonly name: string,
    public active: boolean
  ) {}

  static create(name: string, accountId: string, active?: boolean) {
    if (!name || !accountId) {
      throw new EntityMissingParams(["name", "accountId"]);
    }

    return new Company(Id.createString(), accountId, name, active ?? true);
  }
}
