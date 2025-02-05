import { CompanyRepository } from "../../repositories/CompanyRepository";

export class RemoveUsersToCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(input: RemoveUsersToCompanyInput): Promise<void> {
    await this.companyRepository.removeUsers(input, input.users);
  }
}

export interface RemoveUsersToCompanyInput {
  readonly id: string;
  readonly accountId: string;
  readonly users: { id: string }[];
}
