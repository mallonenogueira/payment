import { Payment } from "@/domain/entities/Payment";

export interface PaymentRepository {
  create(payment: Payment): Promise<void>;
  findById(id: string): Promise<Payment | null>;
}
