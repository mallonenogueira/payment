import { AccountRepository } from "@/application/repositories/AccountRepository";
import { CreateAccountUseCase } from "@/application/usecases/CreateAccountUseCase";
import {
  HttpContext,
  HttpResponseNotFound,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { ResponseWrapper } from "../wrapper/ResponseWrapper";
import { SessionValidation } from "@/infra/auth/SessionValidation";

export class AccountController {
  constructor(
    server: HttpServer,
    private createAccountUseCase: CreateAccountUseCase,
    private accountRepository: AccountRepository
  ) {
    // application admin
    server.get("/admin/account", this.findAll.bind(this));
    server.post("/account", this.create.bind(this));

    server.get("/account", this.findAccount.bind(this));
  }

  async create(ctx: HttpContext) {
    // await new SessionValidation().isApplicationAdmin().auth(ctx);

    return this.createAccountUseCase
      .execute({
        name: ctx.body.name,
        document: ctx.body.document,
        email: ctx.body.email,
      })
      .then(HttpResponseResolver.created);
  }

  async findAll(ctx: HttpContext) {
    await new SessionValidation().isApplicationAdmin().auth(ctx);

    return this.accountRepository.findAll().then(ResponseWrapper.create);
  }

  async findAccount(ctx: HttpContext) {
    const session = await new SessionValidation().auth(ctx);

    const account = await this.accountRepository.findById(session.accountId);

    if (!account) {
      return new HttpResponseNotFound({});
    }

    return account;
  }
}
