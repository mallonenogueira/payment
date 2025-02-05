import { CompanyRepository } from "../../repositories/CompanyRepository";
import { Company } from "@/domain/entities/Company";

export class CreateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(input: CompanyInput): Promise<CompanyOutput> {
    const company = Company.create(input.name, input.accountId);

    await this.companyRepository.create(company);

    return {
      id: company.id,
      accountId: company.accountId,
      name: company.name,
    };
  }
}

export interface CompanyInput {
  readonly accountId: string;
  readonly name: string;
}

export interface CompanyOutput {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
}
