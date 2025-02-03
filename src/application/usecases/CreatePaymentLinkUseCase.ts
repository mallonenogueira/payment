import { ProductRepository } from "../repositories/ProductRepository";
import { PaymentGateway } from "../gateway/PaymentGateWay";
import { AccountRepository } from "../repositories/AccountRepository";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";

export class CreatePaymentLinkUseCase {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private productRepository: ProductRepository,
    private accountRepository: AccountRepository,
    private paymentGateway: PaymentGateway
  ) {}

  async execute(
    input: CreatePaymentLinkInput
  ): Promise<CreatePaymentLinkOutput> {
    const subscription = await this.subscriptionRepository.findById(
      input.subscriptionId
    );

    if (!subscription) {
      throw new Error("Inscrição não encontada.");
    }

    const product = await this.productRepository.findById(
      subscription.productId
    );
    const account = await this.accountRepository.findById(
      subscription.accountId
    );

    if (!account) {
      throw new Error("Conta não encontada.");
    }

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    subscription.startPayment();

    const paymentUrl = await this.paymentGateway.createPaymnetUrl({
      customer: {
        document: account.document,
        email: account.email,
        name: account.name,
      },
      installments: product.installments,
      product: {
        id: product.id,
        price: subscription.price,
        title: product.title,
      },
      subscriptionId: subscription.id,
    });

    this.subscriptionRepository.update(subscription);

    return paymentUrl;
  }
}

export interface CreatePaymentLinkInput {
  readonly subscriptionId: string;
}

export interface CreatePaymentLinkOutput {
  readonly url: string;
  readonly id: string;
}
