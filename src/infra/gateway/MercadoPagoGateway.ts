import {
  CreatePaymentInput,
  CreatePaymentOutput,
  GetPaymentInput,
  GetPaymentOutput,
  PaymentGateway,
} from "@/application/gateway/PaymentGateWay";
import MercadoPagoConfig, { Payment, Preference } from "mercadopago";
import { env } from "../configuration/env";
import { Id } from "@/domain/value-objects/Id";
import { PaymentStatus } from "@/domain/entities/Payment";

export class MercadoPagoGateway implements PaymentGateway {
  constructor(
    private clientMercadoPago: MercadoPagoConfig = new MercadoPagoConfig({
      accessToken: env.mercadoPagoAccessToen,
    }),
    private backUrls = {
      success: "https://desenv.mallone.dev/pagamento-sucesso",
      failure: "https://desenv.mallone.dev/pagamento-erro",
      pending: "https://desenv.mallone.dev/pagamento-pendente",
    }
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
        //additional_info: 'Discount 12,00'
        statement_descriptor: input.product.title, // Aparece no cartão de crédito
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

  async getPayment(input: GetPaymentInput): Promise<GetPaymentOutput> {
    const payment = await new Payment(this.clientMercadoPago).get(input);

    return {
      status: this.getStatus(payment.status),
      gateway: "MERCADO_PAGO",
      installments: payment.installments ?? 1,
      amount: payment.transaction_amount ?? 0,
      createdAt: payment.date_created
        ? new Date(payment.date_created)
        : new Date(),
      updatedAt: payment.date_last_updated
        ? new Date(payment.date_last_updated)
        : null,
      aprrovedAt: payment.date_approved
        ? new Date(payment.date_approved)
        : null,
      subscribeId: payment.external_reference ?? Id.createString(),
      gatewayId: payment.id ? String(payment.id) : null,
    };
  }

  private getStatus(status?: string | null): PaymentStatus {
    if (status === "pending") return PaymentStatus.PENDING;
    if (status === "authorized") return PaymentStatus.PENDING;
    if (status === "in_process") return PaymentStatus.PENDING;
    if (status === "approved") return PaymentStatus.APPROVED;
    if (status === "rejected") return PaymentStatus.CANCELED;
    if (status === "cancelled") return PaymentStatus.CANCELED;
    if (status === "refunded") return PaymentStatus.CANCELED;

    throw new Error("Invalid status - Mercado pago status: " + status);
  }
}
