export class ResponseWrapper<T> {
  constructor(public data: T) {}

  static create<T>(data: T) {
    return new ResponseWrapper(data);
  }
}
