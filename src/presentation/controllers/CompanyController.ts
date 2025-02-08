import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { EntityNotFound } from "@/domain/errors/EntityNotFound";
import { SessionValidation } from "@/infra/auth/SessionValidation";
import { UserRepository } from "@/application/repositories/UserRepository";
import { CompanyRepository } from "@/application/repositories/CompanyRepository";
import { CreateCompanyUseCase } from "@/application/usecases/company/CreateCompanyUseCase";
import { UpdateCompanyUseCase } from "@/application/usecases/company/UpdateCompanyUseCase";
import { AddUsersToCompanyUseCase } from "@/application/usecases/company/AddUsersToCompanyUseCase";
import { RemoveUsersToCompanyUseCase } from "@/application/usecases/company/RemoveUsersToCompanyUseCase";
import { ResponseWrapper } from "../wrapper/ResponseWrapper";

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
    server.get("/company", this.findCompanies.bind(this));
    server.get("/company/:id", this.findOne.bind(this));
    server.post("/company", this.create.bind(this));
    server.put("/company/:id", this.update.bind(this));
    server.put("/company/:id/user", this.addUsers.bind(this));
    server.delete("/company/:id/user", this.removeUsers.bind(this));
  }

  async findCompanies(ctx: HttpContext) {
    const session = await new SessionValidation().isAdmin().auth(ctx);

    return this.companyRepository
      .findByAccountId(session.accountId)
      .then(ResponseWrapper.create);
  }

  async create(ctx: HttpContext) {
    const session = await new SessionValidation().isAdmin().auth(ctx);

    return this.createCompanyUseCase
      .execute({
        name: ctx.body.name,
        accountId: session.accountId,
      })
      .then(HttpResponseResolver.created);
  }

  async update(ctx: HttpContext) {
    const session = await new SessionValidation()
      .isAdmin()
      .hasCompanyId(ctx.params.id)
      .auth(ctx);

    return this.updateCompanyUseCase
      .execute({
        id: ctx.params.id,
        active: ctx.body.active,
        name: ctx.body.name,
        accountId: session.accountId,
      })
      .then(HttpResponseResolver.ok);
  }

  async addUsers(ctx: HttpContext) {
    const session = await new SessionValidation()
      .isAdmin()
      .hasCompanyId(ctx.params.id)
      .auth(ctx);

    return this.addUsersToCompanyUseCase
      .execute({
        id: ctx.params.id,
        users: ctx.body.users,
        accountId: session.accountId,
      })
      .then(HttpResponseResolver.noContent);
  }

  async removeUsers(ctx: HttpContext) {
    const session = await new SessionValidation()
      .isAdmin()
      .hasCompanyId(ctx.params.id)
      .auth(ctx);

    return this.removeUsersToCompanyUseCase
      .execute({
        id: ctx.params.id,
        users: ctx.body.users,
        accountId: session.accountId,
      })
      .then(HttpResponseResolver.noContent);
  }

  async findOne(ctx: HttpContext) {
    await new SessionValidation().hasCompanyId(ctx.params.id).auth(ctx);

    const company = await this.companyRepository.findById(ctx.params.id);

    if (!company) throw new EntityNotFound("Company");

    const users = await this.userRepository.findByCompanyId(ctx.params.id);

    return {
      ...company,
      users,
    };
  }
}
