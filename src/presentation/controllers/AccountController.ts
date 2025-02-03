import { AccountRepository } from "@/application/repositories/AccountRepository";
import { CreateAccountUseCase } from "@/application/usecases/CreateAccountUseCase";
import {
  HttpContext,
  HttpResponseNotFound,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { ResponseWrapper } from "../wrapper/ResponseWrapper";
import { SubscribeRepository } from "@/application/repositories/SubscribeRepository";

export class AccountController {
  constructor(
    server: HttpServer,
    private createAccountUseCase: CreateAccountUseCase,
    private accountRepository: AccountRepository,
    private subscribeRepository: SubscribeRepository
  ) {
    server.post("/account", this.create.bind(this));
    server.get("/account/:id", this.findById.bind(this));
    server.get("/account", this.findAll.bind(this));
    server.get("/account/:id/subscribe", this.findSubscribe.bind(this));
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

  async findSubscribe(ctx: HttpContext) {
    return this.subscribeRepository
      .findByAccountId(ctx.params.id)
      .then(ResponseWrapper.create);
  }

  findAll() {
    return this.accountRepository.findAll().then(ResponseWrapper.create);
  }
}
