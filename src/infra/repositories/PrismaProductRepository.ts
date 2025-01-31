import { prisma } from "./PrismaClient";
import { ProductRepository } from "@/application/repositories/ProductRepository";
import { Product, ProductType } from "@/domain/entities/Product";
import { ProductType as PrismaProductType } from "@prisma/client";

const mapProductType = {
  [PrismaProductType.MONTH]: ProductType.MONTH,
  [PrismaProductType.YEAR]: ProductType.YEAR,
};

export class PrismaProductRepository implements ProductRepository {
  async create(product: Product): Promise<void> {
    await prisma.product.create({
      data: product,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) return null;

    return new Product(
      product.id,
      product.title,
      product.description,
      product.price,
      product.installments,
      mapProductType[product.type],
      product.active
    );
  }

  async listActive(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        active: true,
      },
    });

    return products.map(
      (prismaProduct) =>
        new Product(
          prismaProduct.id,
          prismaProduct.title,
          prismaProduct.description,
          prismaProduct.price,
          prismaProduct.installments,
          mapProductType[prismaProduct.type],
          prismaProduct.active
        )
    );
  }
}
