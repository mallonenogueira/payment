import { prisma } from "./PrismaClient";
import { PaymentRepository } from "@/application/repositories/PaymentRepository";
import { Payment, PaymentStatus } from "@/domain/entities/Payment";

const mapStatus = {
  PENDING: PaymentStatus.PENDING,
  APPROVED: PaymentStatus.APPROVED,
  CANCELED: PaymentStatus.CANCELED,
};

export class PrismaPaymentRepository implements PaymentRepository {
  async findById(id: string): Promise<Payment | null> {
    const payment = await prisma.payment.findUnique({
      where: {
        id,
      },
    });

    if (!payment) return null;

    return new Payment(
      payment.id,
      payment.price,
      payment.installments,
      mapStatus[payment.status],
      payment.accountId,
      payment.subscriptionId,
      payment.createdAt,
      payment.updatedAt,
      payment.approvedAt ?? undefined,
      payment.gateway ?? undefined,
      payment.gatewayId ?? undefined
    );
  }

  async create(payment: Payment): Promise<void> {
    await prisma.payment.create({
      data: payment,
    });
  }
}
