import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { AuthUseCase } from "@/application/usecases/auth/AuthUseCase";
import { GenerateJwtPayloadUseCase } from "@/application/usecases/auth/EncodeJwtPayloadUseCase";
import { UserRole } from "@/domain/entities/User";
import {
  AuthOutput,
  DecodeJwtPayloadUseCase,
} from "@/application/usecases/auth/DecodeJwtPayloadUseCase";
import { ForbiddenError } from "@/domain/errors/ForbiddenError";

async function isAuthenticated(ctx: HttpContext) {
  return new DecodeJwtPayloadUseCase().execute(ctx.headers.authorization ?? "");
}

async function isAdminAuthenticated(ctx: HttpContext) {
  const sessionPayload = await isAuthenticated(ctx);

  if (sessionPayload.role !== UserRole.ADMIN) {
    throw new ForbiddenError("Invalid token.");
  }

  return sessionPayload;
}

async function isEqualAccountId(
  accountIdOrCtx: HttpContext | AuthOutput | string,
  accountId?: string
) {
  if (!accountId) {
    throw new ForbiddenError("Invalid token.");
  }

  if (typeof accountIdOrCtx === "string") {
    if (accountIdOrCtx !== accountId)
      throw new ForbiddenError("Invalid token.");

    return;
  }

  if ("accountId" in accountIdOrCtx) {
    if (accountIdOrCtx.accountId !== accountId)
      throw new ForbiddenError("Invalid token.");

    return;
  }

  const sessionPayload = await isAuthenticated(accountIdOrCtx);

  if (sessionPayload.accountId !== accountId)
    throw new ForbiddenError("Invalid token.");
}

export class AuthController {
  constructor(
    server: HttpServer,
    private authUseCase: AuthUseCase,
    private generateJwtPayloadUseCase: GenerateJwtPayloadUseCase
  ) {
    server.post("/auth", this.login.bind(this));
    server.get("/authenticated", this.test.bind(this));
    server.get("/authenticated-admin", this.testAdmin.bind(this));
    server.get("/authenticated-account", this.account.bind(this));
  }

  async login(ctx: HttpContext) {
    const auth = await this.authUseCase.execute({
      email: ctx.body.email,
      password: ctx.body.password,
    });

    return this.generateJwtPayloadUseCase
      .execute(auth)
      .then(HttpResponseResolver.ok);
  }

  async test(ctx: HttpContext) {
    await isAuthenticated(ctx);
  }

  async testAdmin(ctx: HttpContext) {
    await isAdminAuthenticated(ctx);
  }

  async account(ctx: HttpContext) {
    const r = await isAuthenticated(ctx);
    await isEqualAccountId(r, ctx.query.accountId);
  }
}
