export class ForbiddenError {
  static readonly type = "ForbiddenError";
  readonly type = ForbiddenError.type;

  constructor(readonly message: string) {}
}
