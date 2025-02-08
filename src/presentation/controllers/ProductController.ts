import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { CreateProductUseCase } from "@/application/usecases/CreateProductUseCase";
import { ProductRepository } from "@/application/repositories/ProductRepository";
import { ResponseWrapper } from "../wrapper/ResponseWrapper";
import { SessionValidation } from "@/infra/auth/SessionValidation";

export class ProductController {
  constructor(
    server: HttpServer,
    private createProductUseCase: CreateProductUseCase,
    private productRepository: ProductRepository
  ) {
    server.post("/product", this.create.bind(this));
    server.get("/product", this.findActive.bind(this));
  }

  async create(ctx: HttpContext) {
    await new SessionValidation().isApplicationAdmin().auth(ctx);

    return this.createProductUseCase
      .execute({
        title: ctx.body.title,
        description: ctx.body.description,
        price: ctx.body.price,
        type: ctx.body.type,
        installments: ctx.body.installments,
        active: ctx.body.active,
      })
      .then(HttpResponseResolver.created);
  }

  async findActive() {
    return this.productRepository.listActive().then(ResponseWrapper.create);
  }
}
