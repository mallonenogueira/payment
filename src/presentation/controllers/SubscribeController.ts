import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { CreateSubscribeUseCase } from "@/application/usecases/CreateSubscribeUseCase";
import { CreatePaymentLinkUseCase } from "@/application/usecases/CreatePaymentLinkUseCase";

export class SubscribeController {
  constructor(
    server: HttpServer,
    private createSubscribeUseCase: CreateSubscribeUseCase,
    private createPaymentLinkUseCase: CreatePaymentLinkUseCase,
  ) {
    server.post("/subscribe", this.create.bind(this));
    server.post("/subscribe/:id/link", this.createPaymentLink.bind(this));
  }

  async create(ctx: HttpContext) {
    return this.createSubscribeUseCase
      .execute({
        accountId: ctx.body.accountId,
        expiredAt: new Date(ctx.body.expiredAt),
        productId: ctx.body.productId,
      })
      .then(HttpResponseResolver.created);
  }

  async createPaymentLink(ctx: HttpContext) {
    return this.createPaymentLinkUseCase.execute({
      subscribeId: ctx.params.id
    });
  }
}
