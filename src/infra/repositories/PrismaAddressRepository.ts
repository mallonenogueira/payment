import { Address } from "@/domain/entities/ceremony/Address";
import { AddressRepository } from "@/application/repositories/AddressRepository";
import { PrismaContext } from "../transaction/PrismaTransactionManager";
import { Transaction } from "@/application/transaction/Transaction";

export class PrismaAddressRepository implements AddressRepository {
  constructor(private prisma: PrismaContext) {}

  with(transaction: Transaction<PrismaContext>) {
    return new PrismaAddressRepository(transaction.getContext());
  }

  async create(address: Address): Promise<void> {
    await this.prisma.address.create({
      data: address,
    });
  }

  async update(address: Address): Promise<void> {
    await this.prisma.address.update({
      where: {
        id: address.id,
        accountId: address.accountId,
      },
      data: address,
    });
  }

  async findById(id: string): Promise<Address | null> {
    const prismaAddress = await this.prisma.address.findUnique({
      where: {
        id: id,
      },
    });

    if (!prismaAddress) return null;

    return Address.restore(
      prismaAddress.id,
      prismaAddress.accountId,
      prismaAddress.createdAt,
      prismaAddress.updatedAt,
      prismaAddress.zipCode,
      prismaAddress.name,
      prismaAddress.address,
      prismaAddress.number,
      prismaAddress.city,
      prismaAddress.state,
      prismaAddress.complement ?? undefined
    );
  }

  async findByCeremonyId(): Promise<Address[]> {
    return [];
  }
}
