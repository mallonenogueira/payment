import { Account } from "../../domain/entities/Account";
import { WithTransaction } from "../transaction/WithTransaction";

export interface AccountRepository extends WithTransaction<AccountRepository> {
  create(account: Account): Promise<void>;
  findById(id: string): Promise<Account | null>;
  findAll(): Promise<Account[]>;
}
