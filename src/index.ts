import "dotenv/config";

import { env } from "./infra/configuration/env";
import { ExpressServer } from "./infra/http/ExpressHttpServer";
import { HealthController } from "./presentation/controllers/Health";

function start() {
  const server = new ExpressServer();

  new HealthController(server);

  server.listen(env.port);
}

start();
