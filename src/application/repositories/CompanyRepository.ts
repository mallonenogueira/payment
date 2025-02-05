import { Company } from "../../domain/entities/Company";
import { WithTransaction } from "../transaction/WithTransaction";

export interface CompanyRepository extends WithTransaction<CompanyRepository> {
  create(company: Company): Promise<void>;
  update(company: Company): Promise<void>;
  findById(id: string): Promise<Company | null>;
  findByAccountId(id: string): Promise<Company[]>;
  addUsers(
    company: Pick<Company, "id" | "accountId">,
    users: { id: string }[]
  ): Promise<void>;
  removeUsers(
    company: Pick<Company, "id" | "accountId">,
    users: { id: string }[]
  ): Promise<void>;
}
