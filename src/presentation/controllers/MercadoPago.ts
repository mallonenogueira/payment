import { HttpContext, HttpServer } from "../../infra/http/HttpServer";

export class MercadoPagoController {
  constructor(server: HttpServer) {
    server.post("/mercadopago/webhooks", this.create.bind(this));
  }

  async create(ctx: HttpContext) {
    //Verificar: 81ca289d155b3516beaa265aadabb5a72f88c29af095eadf571a5465d044ef95

    // Webhook
    // action: "payment.created"
    // {
    //   action: "payment.updated",
    //   api_version: "v1",
    //   data: {"id":"AAA"},
    //   date_created: "2021-11-01T02:02:02Z",
    //   id: "123456",
    //   live_mode: false,
    //   type: "payment",
    //   user_id: 2219611008
    // }
    console.log(ctx);
  }
}
