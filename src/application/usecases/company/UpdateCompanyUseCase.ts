import { TransactionManager } from "@/application/transaction/TransactionManager";
import { CompanyRepository } from "../../repositories/CompanyRepository";
import { Company } from "@/domain/entities/Company";

export class UpdateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(input: CompanyInput): Promise<CompanyOutput> {
    const company = new Company(
      input.id,
      input.accountId,
      input.name,
      input.active
    );
    await this.companyRepository.update(company);

    return {
      id: company.id,
      accountId: company.accountId,
      name: company.name,
    };
  }
}

export interface CompanyInput {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly active: boolean;
}

export interface CompanyOutput {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
}
