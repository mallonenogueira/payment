import { HonoredPerson } from "../../domain/entities/ceremony/HonoredPerson";
import { WithTransaction } from "../transaction/WithTransaction";

export interface HonoredPersonRepository extends WithTransaction<HonoredPersonRepository> {
  create(honoredPerson: HonoredPerson): Promise<void>;
  update(honoredPerson: HonoredPerson): Promise<void>;
  findById(id: string, accountId?: string): Promise<HonoredPerson | null>;
  findByCeremonyId(ceremonyId: string, accountId?: string): Promise<HonoredPerson[]>;
}
