import "dotenv/config";

import { env } from "@/infra/configuration/env";
import { ExpressServer } from "@/infra/http/ExpressHttpServer";
import { HealthController } from "@/presentation/controllers/HealthController";
import { SubscribeController } from "@/presentation/controllers/SubscribeController";
import { CreateSubscribeUseCase } from "@/application/usecases/CreateSubscribeUseCase";
import { PrismaProductRepository } from "@/infra/repositories/PrismaProductRepository";
import { PrismaSubscribeRepository } from "@/infra/repositories/PrismaSubscribeRepository";
import { PrismaAccountRepository } from "@/infra/repositories/PrismaAccountRepository";
import { CreateAccountUseCase } from "@/application/usecases/CreateAccountUseCase";
import { AccountController } from "@/presentation/controllers/AccountController";
import { CreateProductUseCase } from "@/application/usecases/CreateProductUseCase";
import { ProductController } from "@/presentation/controllers/ProductController";

function start() {
  const server = new ExpressServer();
  const productRepository = new PrismaProductRepository();
  const subscribeRepository = new PrismaSubscribeRepository();
  const accountRepository = new PrismaAccountRepository();

  const createSubscribeUseCase = new CreateSubscribeUseCase(subscribeRepository, productRepository);
  const createAccountUseCase = new CreateAccountUseCase(accountRepository);
  const createProductUseCase = new CreateProductUseCase(productRepository);

  new HealthController(server);
  new AccountController(server, createAccountUseCase, accountRepository);
  new ProductController(server, createProductUseCase, productRepository);
  new SubscribeController(server, createSubscribeUseCase);

  server.listen(env.port);
}

start();
