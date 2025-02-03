import "dotenv/config";

import { env } from "@/infra/configuration/env";
import { ExpressServer } from "@/infra/http/ExpressHttpServer";
import { HealthController } from "@/presentation/controllers/HealthController";
import { SubscriptionController } from "@/presentation/controllers/SubscriptionController";
import { CreateSubscriptionUseCase } from "@/application/usecases/CreateSubscriptionUseCase";
import { PrismaProductRepository } from "@/infra/repositories/PrismaProductRepository";
import { PrismaSubscriptionRepository } from "@/infra/repositories/PrismaSubscriptionRepository";
import { PrismaAccountRepository } from "@/infra/repositories/PrismaAccountRepository";
import { CreateAccountUseCase } from "@/application/usecases/CreateAccountUseCase";
import { AccountController } from "@/presentation/controllers/AccountController";
import { CreateProductUseCase } from "@/application/usecases/CreateProductUseCase";
import { ProductController } from "@/presentation/controllers/ProductController";
import { CreatePaymentLinkUseCase } from "@/application/usecases/CreatePaymentLinkUseCase";
import { MercadoPagoGateway } from "@/infra/gateway/MercadoPagoGateway";
import { MercadoPagoController } from "./presentation/controllers/MercadoPagoController";
import { PrismaPaymentRepository } from "./infra/repositories/PrismaPaymentRepository";
import { ProcessPaymentUseCase } from "./application/usecases/ProcessPaymentUseCase";
import { ResendMailService } from "./infra/services/ResendMailService";

function start() {
  const server = new ExpressServer();

  const mailService = new ResendMailService();
  const mercadoPagoGateway = new MercadoPagoGateway();

  const paymentRepository = new PrismaPaymentRepository();
  const productRepository = new PrismaProductRepository();
  const subscriptionRepository = new PrismaSubscriptionRepository();
  const accountRepository = new PrismaAccountRepository();

  const createSubscriptionUseCase = new CreateSubscriptionUseCase(
    subscriptionRepository,
    productRepository
  );
  const createAccountUseCase = new CreateAccountUseCase(accountRepository, mailService);
  const createProductUseCase = new CreateProductUseCase(productRepository);
  const createPaymentLinkUseCase = new CreatePaymentLinkUseCase(
    subscriptionRepository,
    productRepository,
    accountRepository,
    mercadoPagoGateway
  );
  const processPaymentUseCase = new ProcessPaymentUseCase(
    subscriptionRepository,
    productRepository,
    paymentRepository
  );

  new HealthController(server);
  new AccountController(
    server,
    createAccountUseCase,
    accountRepository,
    subscriptionRepository
  );
  new ProductController(server, createProductUseCase, productRepository);
  new SubscriptionController(
    server,
    createSubscriptionUseCase,
    createPaymentLinkUseCase
  );
  new MercadoPagoController(server, mercadoPagoGateway, processPaymentUseCase);

  server.listen(env.port);
}

start();
