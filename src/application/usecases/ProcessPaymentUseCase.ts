import { ProductRepository } from "../repositories/ProductRepository";
import { SubscribeRepository } from "../repositories/SubscribeRepository";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { Payment, PaymentStatus } from "@/domain/entities/Payment";

export class ProcessPaymentUseCase {
  constructor(
    private subscribeRepository: SubscribeRepository,
    private productRepository: ProductRepository,
    private paymentRepository: PaymentRepository
  ) {}

  async execute(input: ApproveSubscribeInput): Promise<void> {
    const subscribe = await this.subscribeRepository.findById(
      input.subscribeId
    );

    if (!subscribe) {
      throw new Error("Inscrição não encontada.");
    }

    const product = await this.productRepository.findById(subscribe.productId);

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    const payment = Payment.create(
      input.amount,
      input.installments,
      input.status,
      subscribe.accountId,
      input.subscribeId,
      input.createdAt,
      input.updatedAt ?? undefined,
      input.aprrovedAt ?? undefined,
      input.gateway ?? undefined,
      input.gatewayId ?? undefined
    );

    this.paymentRepository.create(payment);

    if (payment.status === PaymentStatus.APPROVED) {
      subscribe.approve(product.type);
      this.subscribeRepository.update(subscribe);
    }
  }
}

export interface ApproveSubscribeInput {
  gateway: "MERCADO_PAGO";
  installments: number;
  status: PaymentStatus;
  amount: number;
  createdAt: Date;
  updatedAt?: Date | null;
  aprrovedAt?: Date | null;
  subscribeId: string;
  gatewayId?: string | null;
}
