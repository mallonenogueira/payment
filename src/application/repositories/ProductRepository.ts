import { Product } from "@/domain/entities/payment/Product";

export interface ProductRepository {
  create(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  listActive(): Promise<Product[]>;
}  

