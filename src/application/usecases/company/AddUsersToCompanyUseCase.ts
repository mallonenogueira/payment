import { CompanyRepository } from "../../repositories/CompanyRepository";

export class AddUsersToCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(input: AddUsersToCompanyInput): Promise<void> {
    await this.companyRepository.addUsers(input, input.users);
  }
}

export interface AddUsersToCompanyInput {
  readonly id: string;
  readonly accountId: string;
  readonly users: { id: string }[];
}
