import "dotenv/config";

import { env } from "./infra/configuration/env";
import { ExpressServer } from "./infra/http/ExpressHttpServer";
import { HealthController } from "./presentation/controllers/Health";
import { SubscribeController } from "./presentation/controllers/Subscribe";
import { MercadoPagoController } from "./presentation/controllers/MercadoPago";

function start() {
  const server = new ExpressServer();

  new HealthController(server);
  new SubscribeController(server);
  new MercadoPagoController(server);

  server.listen(env.port);
}

start();
