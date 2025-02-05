import { Transaction } from "@/application/transaction/Transaction";
import { TransactionManager } from "@/application/transaction/TransactionManager";
import { PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type PrismaContext = Omit<
  PrismaClient<any, never, DefaultArgs>,
  "$on" | "$connect" | "$disconnect" | "$use" | "$transaction" | "$extends"
>;

export class PrismaTransaction implements Transaction<PrismaContext> {
  private context: PrismaContext | null = null;

  constructor(private transactionManager: TransactionManager<PrismaContext>) {}

  getContext(): PrismaContext {
    if (!this.context) {
      throw new Error("A transação ainda não foi inicializada.");
    }
    return this.context;
  }

  async execute(
    fn: (t: Transaction<PrismaContext>) => Promise<void>
  ): Promise<void> {
    await this.transactionManager.execute(async (ctx) => {
      this.context = ctx;

      await fn(this);
    });
  }
}

export class PrismaTransactionManager
  implements TransactionManager<PrismaContext>
{
  constructor(private prisma: PrismaClient) {}

  create(): Transaction<PrismaContext> {
    return new PrismaTransaction(this);
  }

  async execute(fn: (ctx: PrismaContext) => Promise<void>) {
    await this.prisma.$transaction(async (ctx) => {
      await fn(ctx);
    });
  }
}
