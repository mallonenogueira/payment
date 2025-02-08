import { UserRole } from "@/domain/entities/User";
import {
  AuthOutput,
  DecodeJwtPayloadUseCase,
} from "@/application/usecases/auth/DecodeJwtPayloadUseCase";
import { ForbiddenError } from "@/domain/errors/ForbiddenError";
import { HttpContext } from "../http/HttpServer";

export class SessionValidation {
  private session?: AuthOutput;
  private checks: ((session: AuthOutput) => void)[] = [];

  isAdmin() {
    this.checks.push((session: AuthOutput) => {
      if (session.role !== UserRole.ADMIN) {
        throw new ForbiddenError("Invalid token.");
      }
    });

    return this;
  }

  hasAccountId(accountId: string) {
    this.checks.push((session: AuthOutput) => {
      if (session.accountId !== accountId) {
        throw new ForbiddenError("Invalid token.");
      }
    });

    return this;
  }

  hasCompanyId(accountId: string) {
    this.checks.push((session: AuthOutput) => {
      // if (session.accountId !== accountId) {
      //   throw new ForbiddenError("Invalid token.");
      // }
    });

    return this;
  }

  isApplicationAdmin() {
    this.checks.push((session: AuthOutput) => {
      /**
       * Alterar para autenticação de administrador do sistema
       */
      if (session.role !== UserRole.ADMIN) {
        throw new ForbiddenError("Invalid token.");
      }
    });

    return this;
  }

  async auth(ctx: HttpContext) {

    this.session = await new DecodeJwtPayloadUseCase().execute(
      ctx.headers.authorization ?? ""
    );

    for (const check of this.checks) {
      check(this.session);
    }

    return this.session;
  }
}
