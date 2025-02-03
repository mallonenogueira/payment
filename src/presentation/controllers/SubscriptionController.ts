import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { CreateSubscriptionUseCase } from "@/application/usecases/CreateSubscriptionUseCase";
import { CreatePaymentLinkUseCase } from "@/application/usecases/CreatePaymentLinkUseCase";

export class SubscriptionController {
  constructor(
    server: HttpServer,
    private createSubscriptionUseCase: CreateSubscriptionUseCase,
    private createPaymentLinkUseCase: CreatePaymentLinkUseCase
  ) {
    server.post("/subscription", this.create.bind(this));
    server.post("/subscription/:id/link", this.createPaymentLink.bind(this));
  }

  async create(ctx: HttpContext) {
    return this.createSubscriptionUseCase
      .execute({
        accountId: ctx.body.accountId,
        productId: ctx.body.productId,
      })
      .then(HttpResponseResolver.created);
  }

  async createPaymentLink(ctx: HttpContext) {
    return this.createPaymentLinkUseCase.execute({
      subscriptionId: ctx.params.id,
    });
  }
}
