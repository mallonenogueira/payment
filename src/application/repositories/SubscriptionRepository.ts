import { Subscription } from "@/domain/entities/payment/Subscription";

export interface SubscriptionRepository {
  create(subscription: Subscription): Promise<void>;
  update(subscription: Subscription): Promise<void>;
  findById(id: string): Promise<Subscription | null>;
  findByAccountId(id: string): Promise<Subscription[]>;
}
