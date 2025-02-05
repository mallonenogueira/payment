import { AccountRepository } from "@/application/repositories/AccountRepository";
import { CreateAccountUseCase } from "@/application/usecases/CreateAccountUseCase";
import {
  HttpContext,
  HttpResponseNotFound,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { ResponseWrapper } from "../wrapper/ResponseWrapper";
import { SubscriptionRepository } from "@/application/repositories/SubscriptionRepository";
import { CompanyRepository } from "@/application/repositories/CompanyRepository";
import { UserRepository } from "@/application/repositories/UserRepository";

export class AccountController {
  constructor(
    server: HttpServer,
    private createAccountUseCase: CreateAccountUseCase,
    private accountRepository: AccountRepository,
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository,
    private subscriptionRepository: SubscriptionRepository
  ) {
    server.post("/account", this.create.bind(this));
    server.get("/account/:id", this.findById.bind(this));
    server.get("/account", this.findAll.bind(this));
    server.get("/account/:id/subscription", this.findSubscription.bind(this));
    server.get("/account/:id/company", this.findCompanies.bind(this));
    server.get("/account/:id/user", this.findUsers.bind(this));
  }

  create(ctx: HttpContext) {
    return this.createAccountUseCase
      .execute({
        name: ctx.body.name,
        document: ctx.body.document,
        email: ctx.body.email,
      })
      .then(HttpResponseResolver.created);
  }

  async findById(ctx: HttpContext) {
    const account = await this.accountRepository.findById(ctx.params.id);

    if (!account) {
      return new HttpResponseNotFound({});
    }

    return account;
  }

  async findSubscription(ctx: HttpContext) {
    return this.subscriptionRepository
      .findByAccountId(ctx.params.id)
      .then(ResponseWrapper.create);
  }

  findAll() {
    return this.accountRepository.findAll().then(ResponseWrapper.create);
  }

  findCompanies(ctx: HttpContext) {
    return this.companyRepository
      .findByAccountId(ctx.params.id)
      .then(ResponseWrapper.create);
  }

  findUsers(ctx: HttpContext) {
    return this.userRepository
      .findByAccountId(ctx.params.id)
      .then(ResponseWrapper.create);
  }
}
