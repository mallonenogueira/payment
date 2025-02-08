import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { AuthUseCase } from "@/application/usecases/auth/AuthUseCase";
import { GenerateJwtPayloadUseCase } from "@/application/usecases/auth/EncodeJwtPayloadUseCase";

export class AuthController {
  constructor(
    server: HttpServer,
    private authUseCase: AuthUseCase,
    private generateJwtPayloadUseCase: GenerateJwtPayloadUseCase
  ) {
    server.post("/auth", this.login.bind(this));
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
}
