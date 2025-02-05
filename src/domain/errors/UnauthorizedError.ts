export class UnauthorizedError {
  static readonly type = "UnauthorizedError";
  readonly type = UnauthorizedError.type;

  constructor(readonly message: string) {}
}
