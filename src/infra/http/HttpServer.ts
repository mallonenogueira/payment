import { IncomingHttpHeaders } from "http";

export interface HttpContext<B = any, Q = any> {
  headers: IncomingHttpHeaders;
  body: B;
  query: Q;
  params: {
    [key: string]: string;
  };
}

export interface IHttpResponse<T> {
  _status: number;
  _data?: T;
}

export class HttpResponse<T> implements IHttpResponse<T> {
  constructor(public _status: number, public _data: T) {}
}

export class HttpResponseNotFound<T> extends HttpResponse<T> {
  constructor(public _data: T) {
    super(404, _data);
  }
}

export class HttpResponseOk<T> extends HttpResponse<T> {
  constructor(public _data: T) {
    super(200, _data);
  }
}

export class HttpResponseNoContent extends HttpResponse<undefined> {
  constructor() {
    super(204, undefined);
  }
}

export class HttpResponseCreated<T> extends HttpResponse<T> {
  constructor(public _data: T) {
    super(201, _data);
  }
}

export const HttpResponseResolver = {
  created: <T>(d: T) => new HttpResponseCreated(d),
  ok: <T>(d: T) => new HttpResponseOk(d),
  noContent: <T>(d: T) => new HttpResponseNoContent(),
};

export type HttpHandler<T, R extends HttpContext = HttpContext> = (
  context: R
) => IHttpResponse<T> | Promise<IHttpResponse<T>> | T | Promise<T>;

export interface HttpServer {
  get<T>(path: string, handler: HttpHandler<T>): void;
  post<T>(path: string, handler: HttpHandler<T>): void;
  put<T>(path: string, handler: HttpHandler<T>): void;
  patch<T>(path: string, handler: HttpHandler<T>): void;
  delete<T>(path: string, handler: HttpHandler<T>): void;
  listen(port: number): void;
}
