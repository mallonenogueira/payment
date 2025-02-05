import {
  HttpContext,
  HttpResponseResolver,
  HttpServer,
} from "@/infra/http/HttpServer";
import { CreateUserUseCase } from "@/application/usecases/user/CreateUserUseCase";
import { UpdateUserUseCase } from "@/application/usecases/user/UpdateUserUseCase";
import { UserRepository } from "@/application/repositories/UserRepository";
import { EntityNotFound } from "@/domain/errors/EntityNotFound";

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
  }

  create(ctx: HttpContext) {
    return this.createUserUseCase
      .execute({
        role: ctx.body.role,
        name: ctx.body.name,
        email: ctx.body.email,
        accountId: ctx.body.accountId,
      })
      .then(HttpResponseResolver.created);
  }

  update(ctx: HttpContext) {
    return this.updateUserUseCase
      .execute({
        id: ctx.params.id,
        role: ctx.body.role,
        name: ctx.body.name,
        email: ctx.body.email,
        accountId: ctx.body.accountId,
      })
      .then(HttpResponseResolver.ok);
  }

  async findOne(ctx: HttpContext) {
    const user = await this.userRepository.findById(ctx.params.id);
    if (!user) throw new EntityNotFound("User");
    return user;
  }
}
