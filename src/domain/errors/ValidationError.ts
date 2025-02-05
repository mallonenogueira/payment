export class ValidationError {
  static readonly type = "ValidationError";
  readonly type = ValidationError.type;

  constructor(readonly message: string) {}
}
