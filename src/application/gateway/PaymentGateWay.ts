export interface CreatePaymentInput {
  subscribeId: string;
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

export interface PaymentGateway {
  createPaymnetUrl(input: CreatePaymentInput): Promise<CreatePaymentOutput>;
}
