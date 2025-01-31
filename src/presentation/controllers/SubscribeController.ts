import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { CreateSubscribeUseCase } from "@/application/usecases/CreateSubscribeUseCase";

export class SubscribeController {
  constructor(
    server: HttpServer,
    private createSubscribreUseCase: CreateSubscribeUseCase
  ) {
    server.post("/subscribe", this.create.bind(this));
  }

  async create(ctx: HttpContext) {
    return this.createSubscribreUseCase
      .execute({
        accountId: ctx.body.accountId,
        expiredAt: new Date(ctx.body.expiredAt),
        productId: ctx.body.productId,
      })
      .then(HttpResponseResolver.created);
  }
}
