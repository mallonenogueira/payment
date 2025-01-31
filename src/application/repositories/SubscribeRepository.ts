import { Subscribe } from "@/domain/entities/Subscribe";

export interface SubscribeRepository {
  create(subscribe: Subscribe): Promise<void>;
}
