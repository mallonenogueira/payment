import { PaymentStatus } from "@/domain/entities/Payment";

export interface CreatePaymentInput {
  subscriptionId: string;
  installments: number;
  product: {
    id: string;
    price: number;
    title: string;
  };
  customer: {
    name: string;
    document: string;
    email: string;
  };
}

export interface CreatePaymentOutput {
  url: string;
  id: string;
}

export interface GetPaymentInput {
  id: string;
}

export interface GetPaymentOutput {
  gateway: "MERCADO_PAGO";
  installments: number;
  status: PaymentStatus;
  amount: number;
  createdAt: Date;
  updatedAt?: Date | null;
  aprrovedAt?: Date | null;
  subscriptionId: string;
  gatewayId?: string | null;
}

export interface PaymentGateway {
  createPaymnetUrl(input: CreatePaymentInput): Promise<CreatePaymentOutput>;
  getPayment(input: GetPaymentInput): Promise<GetPaymentOutput>;
}
