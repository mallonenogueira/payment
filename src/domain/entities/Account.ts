import { EntityMissingParams } from "../errors/EntityMissingParams";
import { Id } from "../value-objects/Id";

export class Account {
  constructor(
    readonly id: string,
    readonly document: string,
    readonly name: string,
    readonly email: string
  ) {}

  static create(document: string, name: string, email: string) {
    if (!document || !name || !email) {
      throw new EntityMissingParams(["email", "name", "document"]);
    }

    return new Account(Id.createString(), document, name, email);
  }
}
