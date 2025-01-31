import { Product } from "@/domain/entities/Product";

export interface ProductRepository {
  create(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  listActive(): Promise<Product[]>;
}  

