import { PaymentGateway } from "@/application/gateway/PaymentGateWay";
import { HttpContext, HttpServer } from "../../infra/http/HttpServer";
import { ProcessPaymentUseCase } from "@/application/usecases/ProcessPaymentUseCase";

interface MercadoPagoPaymentEvent {
  action: string;
  api_version: string;
  data: { id: string };
  date_created: string;
  id: string;
  live_mode: false;
  type: string;
  user_id: number;
}

export class MercadoPagoController {
  constructor(
    server: HttpServer,
    private paymentGateway: PaymentGateway,
    private processPaymentUseCase: ProcessPaymentUseCase
  ) {
    server.post("/mercadopago/webhooks", this.webhooks.bind(this));
  }

  //Verificar: 81ca289d155b3516beaa265aadabb5a72f88c29af095eadf571a5465d044ef95
  async webhooks(ctx: HttpContext<MercadoPagoPaymentEvent>) {
    if (ctx.body.action === "payment.created") {
      const payment = await this.paymentGateway.getPayment(ctx.body.data);
      await this.processPaymentUseCase.execute(payment);
    }

    console.log(ctx);
  }
}
