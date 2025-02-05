import { Transaction } from "./Transaction";

export interface TransactionManager<TContext = any> {
  create(): Transaction<TContext>;
  execute(fn: (ctx: TContext) => Promise<void>): Promise<void>;
}
