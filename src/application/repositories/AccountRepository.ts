import { Account } from "../../domain/entities/Account";

export interface AccountRepository {
  create(account: Account): Promise<void>;
  findById(id: string): Promise<Account | null>;
  findAll(): Promise<Account[]>;
}
