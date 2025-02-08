import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { CreateSubscriptionUseCase } from "@/application/usecases/CreateSubscriptionUseCase";
import { CreatePaymentLinkUseCase } from "@/application/usecases/CreatePaymentLinkUseCase";
import { SessionValidation } from "@/infra/auth/SessionValidation";
import { SubscriptionRepository } from "@/application/repositories/SubscriptionRepository";
import { ResponseWrapper } from "../wrapper/ResponseWrapper";

export class SubscriptionController {
  constructor(
    server: HttpServer,
    private createSubscriptionUseCase: CreateSubscriptionUseCase,
    private createPaymentLinkUseCase: CreatePaymentLinkUseCase,
    private subscriptionRepository: SubscriptionRepository
  ) {
    server.get("/subscription", this.findSubscription.bind(this));
    server.post("/subscription", this.create.bind(this));
    server.post("/subscription/:id/link", this.createPaymentLink.bind(this));
  }

  async findSubscription(ctx: HttpContext) {
    const session = await new SessionValidation().isAdmin().auth(ctx);

    return this.subscriptionRepository
      .findByAccountId(session.accountId)
      .then(ResponseWrapper.create);
  }

  async create(ctx: HttpContext) {
    const session = await new SessionValidation().isAdmin().auth(ctx);

    return this.createSubscriptionUseCase
      .execute({
        accountId: session.accountId,
        productId: ctx.body.productId,
      })
      .then(HttpResponseResolver.created);
  }

  async createPaymentLink(ctx: HttpContext) {
    await new SessionValidation().isAdmin().auth(ctx);

    return this.createPaymentLinkUseCase.execute({
      subscriptionId: ctx.params.id,
    });
  }
}
