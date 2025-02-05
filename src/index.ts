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
import { PrismaTransactionManager } from "./infra/transaction/PrismaTransactionManager";
import { prisma } from "./infra/repositories/PrismaClient";
import { PrismaCompanyRepository } from "./infra/repositories/PrismaCompanyRepository";
import { PrismaUserRepository } from "./infra/repositories/PrismaUserRepository";
import { CompanyController } from "./presentation/controllers/CompanyController";
import { CreateCompanyUseCase } from "./application/usecases/company/CreateCompanyUseCase";
import { UpdateCompanyUseCase } from "./application/usecases/company/UpdateCompanyUseCase";
import { AddUsersToCompanyUseCase } from "./application/usecases/company/AddUsersToCompanyUseCase";
import { RemoveUsersToCompanyUseCase } from "./application/usecases/company/RemoveUsersToCompanyUseCase";
import { CreateUserUseCase } from "./application/usecases/user/CreateUserUseCase";
import { UpdateUserUseCase } from "./application/usecases/user/UpdateUserUseCase";
import { UserController } from "./presentation/controllers/UserController";
import { GenerateJwtPayloadUseCase } from "./application/usecases/auth/EncodeJwtPayloadUseCase";
import { AuthUseCase } from "./application/usecases/auth/AuthUseCase";
import { AuthController } from "./presentation/controllers/AuthController";

function start() {
  const server = new ExpressServer();

  const mailService = new ResendMailService();
  const mercadoPagoGateway = new MercadoPagoGateway();

  const transactionManager = new PrismaTransactionManager(prisma);
  const paymentRepository = new PrismaPaymentRepository();
  const productRepository = new PrismaProductRepository();
  const subscriptionRepository = new PrismaSubscriptionRepository();
  const accountRepository = new PrismaAccountRepository(prisma);
  const companyRepository = new PrismaCompanyRepository(prisma);
  const userRepository = new PrismaUserRepository(prisma);

  const addUsersToCompanyUseCase = new AddUsersToCompanyUseCase(
    companyRepository
  );
  const removeUsersToCompanyUseCase = new RemoveUsersToCompanyUseCase(
    companyRepository
  );

  const createSubscriptionUseCase = new CreateSubscriptionUseCase(
    subscriptionRepository,
    productRepository
  );
  const createAccountUseCase = new CreateAccountUseCase(
    transactionManager,
    accountRepository,
    companyRepository,
    userRepository,
    mailService
  );

  const createUserUseCase = new CreateUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);
  const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);
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
  const authUseCase = new AuthUseCase(userRepository);
  const generateJwtPayloadUseCase = new GenerateJwtPayloadUseCase();

  new HealthController(server);
  new AccountController(
    server,
    createAccountUseCase,
    accountRepository,
    companyRepository,
    userRepository,
    subscriptionRepository
  );
  new CompanyController(
    server,
    createCompanyUseCase,
    updateCompanyUseCase,
    addUsersToCompanyUseCase,
    removeUsersToCompanyUseCase,
    companyRepository,
    userRepository
  );
  new UserController(
    server,
    createUserUseCase,
    updateUserUseCase,
    userRepository
  );
  new ProductController(server, createProductUseCase, productRepository);
  new SubscriptionController(
    server,
    createSubscriptionUseCase,
    createPaymentLinkUseCase
  );
  new MercadoPagoController(server, mercadoPagoGateway, processPaymentUseCase);
  new AuthController(server, authUseCase, generateJwtPayloadUseCase);

  server.listen(env.port);
}

start();
