import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { CompanyRepository } from "@/application/repositories/CompanyRepository";
import { CreateCompanyUseCase } from "@/application/usecases/company/CreateCompanyUseCase";
import { UpdateCompanyUseCase } from "@/application/usecases/company/UpdateCompanyUseCase";
import { UserRepository } from "@/application/repositories/UserRepository";
import { EntityNotFound } from "@/domain/errors/EntityNotFound";
import { AddUsersToCompanyUseCase } from "@/application/usecases/company/AddUsersToCompanyUseCase";
import { RemoveUsersToCompanyUseCase } from "@/application/usecases/company/RemoveUsersToCompanyUseCase";

export class CompanyController {
  constructor(
    server: HttpServer,
    private createCompanyUseCase: CreateCompanyUseCase,
    private updateCompanyUseCase: UpdateCompanyUseCase,
    private addUsersToCompanyUseCase: AddUsersToCompanyUseCase,
    private removeUsersToCompanyUseCase: RemoveUsersToCompanyUseCase,
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository
  ) {
    server.post("/company", this.create.bind(this));
    server.put("/company/:id", this.update.bind(this));
    server.get("/company/:id", this.findOne.bind(this));
    server.put("/company/:id/user", this.addUsers.bind(this));
    server.delete("/company/:id/user", this.removeUsers.bind(this));
  }

  create(ctx: HttpContext) {
    return this.createCompanyUseCase
      .execute({
        name: ctx.body.name,
        accountId: ctx.body.accountId,
      })
      .then(HttpResponseResolver.created);
  }

  update(ctx: HttpContext) {
    return this.updateCompanyUseCase
      .execute({
        id: ctx.params.id,
        active: ctx.body.active,
        name: ctx.body.name,
        accountId: ctx.body.accountId,
      })
      .then(HttpResponseResolver.ok);
  }

  addUsers(ctx: HttpContext) {
    return this.addUsersToCompanyUseCase
      .execute({
        id: ctx.params.id,
        users: ctx.body.users,
        accountId: ctx.body.accountId,
      })
      .then(HttpResponseResolver.noContent);
  }

  removeUsers(ctx: HttpContext) {
    return this.removeUsersToCompanyUseCase
      .execute({
        id: ctx.params.id,
        users: ctx.body.users,
        accountId: ctx.body.accountId,
      })
      .then(HttpResponseResolver.noContent);
  }

  async findOne(ctx: HttpContext) {
    const company = await this.companyRepository.findById(ctx.params.id);

    if (!company) throw new EntityNotFound("Company");

    const users = await this.userRepository.findByCompanyId(ctx.params.id);

    return {
      ...company,
      users,
    };
  }
}
