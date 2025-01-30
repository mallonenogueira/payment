import { HttpServer } from "../../infra/http/HttpServer";

export class HealthController {
  constructor(server: HttpServer) {
    server.get("/health", this.health.bind(this));
  }

  health() {
    return { ok: true, status: 200 };
  }
}
