import { HttpServer } from "../../infra/http/HttpServer";

export class SubscribeController {
  constructor(server: HttpServer) {
    server.post("/subscribe", this.create.bind(this));
  }

  create() {
    return { ok: true };
  }
}
