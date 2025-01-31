import { ProductRepository } from "../repositories/ProductRepository";
import { PaymentGateway } from "../gateway/PaymentGateWay";
import { AccountRepository } from "../repositories/AccountRepository";
import { SubscribeRepository } from "../repositories/SubscribeRepository";

export class CreatePaymentLinkUseCase {
  constructor(
    private subscribeRepository: SubscribeRepository,
    private productRepository: ProductRepository,
    private accountRepository: AccountRepository,
    private paymentGateway: PaymentGateway
  ) {}

  async execute(
    input: CreatePaymentLinkInput
  ): Promise<CreatePaymentLinkOutput> {
    const subscribe = await this.subscribeRepository.findById(input.subscribeId);
    
    if (!subscribe) {
      throw new Error("Inscrição não encontada.");
    }
    
    const product = await this.productRepository.findById(subscribe.productId);
    const account = await this.accountRepository.findById(subscribe.accountId);

    if (!account) {
      throw new Error("Conta não encontada.");
    }

    if (!product) {
      throw new Error("Produto não encontrado.");
    }

    const paymentUrl = await this.paymentGateway.createPaymnetUrl({
      customer: {
        document: account.document,
        email: account.email,
        name: account.name,
      },
      installments: product.installments,
      product: {
        id: product.id,
        price: subscribe.price,
        title: product.title,
      },
      subscribeId: subscribe.id,
    });

    return paymentUrl;
  }
}

export interface CreatePaymentLinkInput {
  readonly subscribeId: string;
}

export interface CreatePaymentLinkOutput {
  readonly url: string;
  readonly id: string;
}
