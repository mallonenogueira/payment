import { EntityMissingParams } from "../errors/EntityMissingParams";
import { Id } from "../value-objects/Id";
import { Password } from "../value-objects/Password";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export class User {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly role: UserRole,
    readonly accountId: string,
    readonly createdAt?: Date,
    readonly password?: string,
    readonly updatedAt?: Date
  ) {}

  static create(
    name: string,
    email: string,
    role: UserRole,
    accountId: string
  ) {
    if (!name || !email || !role || !accountId) {
      throw new EntityMissingParams(["name", "email", "role", "accountId"]);
    }

    return new User(
      Id.createString(),
      name,
      email,
      role,
      accountId,
      new Date(),
      Password.hash('Padrao12.'),
    );
  }
}
