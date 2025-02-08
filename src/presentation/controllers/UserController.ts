import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { CreateUserUseCase } from "@/application/usecases/user/CreateUserUseCase";
import { UpdateUserUseCase } from "@/application/usecases/user/UpdateUserUseCase";
import { UserRepository } from "@/application/repositories/UserRepository";
import { EntityNotFound } from "@/domain/errors/EntityNotFound";
import { SessionValidation } from "@/infra/auth/SessionValidation";
import { ResponseWrapper } from "../wrapper/ResponseWrapper";

export class UserController {
  constructor(
    server: HttpServer,
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private userRepository: UserRepository
  ) {
    server.post("/user", this.create.bind(this));
    server.put("/user/:id", this.update.bind(this));
    server.get("/user/:id", this.findOne.bind(this));
    server.get("/user", this.findUsers.bind(this));
  }

  async create(ctx: HttpContext) {
    const session = await new SessionValidation().isAdmin().auth(ctx);

    return this.createUserUseCase
      .execute({
        role: ctx.body.role,
        name: ctx.body.name,
        email: ctx.body.email,
        accountId: session.accountId,
      })
      .then(HttpResponseResolver.created);
  }

  async update(ctx: HttpContext) {
    const session = await new SessionValidation().isAdmin().auth(ctx);

    return this.updateUserUseCase
      .execute({
        id: ctx.params.id,
        role: ctx.body.role,
        name: ctx.body.name,
        email: ctx.body.email,
        accountId: session.accountId,
      })
      .then(HttpResponseResolver.ok);
  }

  async findOne(ctx: HttpContext) {
    const session = await new SessionValidation().isAdmin().auth(ctx);

    const user = await this.userRepository.findById(
      ctx.params.id,
      session.accountId
    );

    if (!user) throw new EntityNotFound("User");
    
    return user;
  }

  async findUsers(ctx: HttpContext) {
    const session = await new SessionValidation().isAdmin().auth(ctx);

    return this.userRepository
      .findByAccountId(session.accountId)
      .then(ResponseWrapper.create);
  }
}
