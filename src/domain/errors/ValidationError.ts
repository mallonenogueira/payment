export class ValidationError extends Error {
  static readonly type = 'ValidationError';
  readonly type = ValidationError.type;

  constructor(message: string) {
    super(message);
  }
}
