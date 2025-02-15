import { Ceremony } from "../../domain/entities/ceremony/Ceremony";
import { WithTransaction } from "../transaction/WithTransaction";

export interface CeremonyRepository extends WithTransaction<CeremonyRepository> {
  create(ceremony: Ceremony): Promise<void>;
  update(ceremony: Ceremony): Promise<void>;
  findById(id: string, accountId?: string): Promise<Ceremony | null>;
  findByCompanyId(companyId: string, accountId?: string): Promise<Ceremony[]>;
}
