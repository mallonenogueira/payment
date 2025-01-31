import {
  CreatePaymentInput,
  CreatePaymentOutput,
  PaymentGateway,
} from "@/application/gateway/PaymentGateWay";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { env } from "../configuration/env";

export class MercadoPagoGateway implements PaymentGateway {
  constructor(
    private clientMercadoPago: MercadoPagoConfig = new MercadoPagoConfig({
      accessToken: env.mercadoPagoAccessToen,
    }),
    private backUrls = {
      success: "https://desenv.mallone.dev",
      failure: "https://desenv.mallone.dev",
      pending: "https://desenv.mallone.dev",
    },
    private notificationUrl = "https://desenv.mallone.dev/api/subscribe/:id/notification"
  ) {}

  async createPaymnetUrl(
    input: CreatePaymentInput
  ): Promise<CreatePaymentOutput> {
    const preference = new Preference(this.clientMercadoPago);

    const preferenceResponse = await preference.create({
      body: {
        auto_return: "all",
        external_reference: input.subscribeId,
        back_urls: this.backUrls,
        notification_url: this.notificationUrl.replace(
          ":id",
          input.subscribeId
        ),
        //additional_info: 'Discount 12,00'
        statement_descriptor: input.product.title, // Cartão de crédito
        items: [
          {
            category_id: "virtual_goods",
            id: input.product.id,
            title: input.product.title,
            quantity: 1,
            unit_price: input.product.price,
            currency_id: "BRL",
          },
        ],
        payer: {
          name: input.customer.name,
          email: input.customer.email,
          identification: {
            number: input.customer.document,
          },
        },
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          default_payment_method_id: "",
          installments: input.installments,
          default_installments: 1,
        },
      },
    });

    if (!preferenceResponse.id || !preferenceResponse.init_point) {
      throw new Error("Erro ao gerar Link mercado pago.");
    }

    return {
      url: preferenceResponse.init_point,
      id: preferenceResponse.id,
    };
  }
}
