import { User } from "../../domain/entities/User";
import { WithTransaction } from "../transaction/WithTransaction";

export interface UserRepository extends WithTransaction<UserRepository> {
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  findByAccountId(accountId: string): Promise<User[]>;
  findByCompanyId(companyId: string, accountId?: string): Promise<User[]>;
  findById(id: string, accountId?: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
