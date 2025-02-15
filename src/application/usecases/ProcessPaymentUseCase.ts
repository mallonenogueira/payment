import { ProductRepository } from "../repositories/ProductRepository";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { Payment, PaymentStatus } from "@/domain/entities/payment/Payment";
import { ValidationError } from "@/domain/errors/ValidationError";

export class ProcessPaymentUseCase {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private productRepository: ProductRepository,
    private paymentRepository: PaymentRepository
  ) {}

  async execute(input: ApproveSubscriptionInput): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(
      input.subscriptionId
    );

    if (!subscription) {
      throw new ValidationError("Inscrição não encontada.");
    }

    const product = await this.productRepository.findById(subscription.productId);

    if (!product) {
      throw new ValidationError("Produto não encontrado.");
    }

    const payment = Payment.create(
      input.amount,
      input.installments,
      input.status,
      subscription.accountId,
      input.subscriptionId,
      input.createdAt,
      input.updatedAt ?? undefined,
      input.aprrovedAt ?? undefined,
      input.gateway ?? undefined,
      input.gatewayId ?? undefined
    );

    this.paymentRepository.create(payment);

    if (payment.status === PaymentStatus.APPROVED) {
      subscription.approve(product.type);
      this.subscriptionRepository.update(subscription);
    }
  }
}

export interface ApproveSubscriptionInput {
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
