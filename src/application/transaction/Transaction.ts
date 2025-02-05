export interface Transaction<TContext = any> {
  getContext(): TContext;
  execute(fn: (t: Transaction<TContext>) => Promise<void>): Promise<void>;
}
