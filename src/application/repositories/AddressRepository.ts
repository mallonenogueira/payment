import { Address } from "../../domain/entities/ceremony/Address";
import { WithTransaction } from "../transaction/WithTransaction";

export interface AddressRepository extends WithTransaction<AddressRepository> {
  create(address: Address): Promise<void>;
  update(address: Address): Promise<void>;
  findById(id: string, accountId?: string): Promise<Address | null>;
  findByCeremonyId(ceremonyId: string, accountId?: string): Promise<Address[] | null>;
}
