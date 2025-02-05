import { Transaction } from "./Transaction";

export interface WithTransaction<T> {
  with(transaction: Transaction): T;
}
