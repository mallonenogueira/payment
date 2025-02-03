import express from "express";
import helmet from "helmet";
import { HttpHandler, HttpResponse, HttpServer } from "./HttpServer";
import { expressErrorHandler } from "./ExpressErrorHandler";

function handlerAdapter<T>(handler: HttpHandler<T>) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const response = await handler({
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (response instanceof HttpResponse) {
        return res.status(response._status).send(response._data);
      }

      if (response === undefined) {
        return res.status(204).send(response);
      }

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  };
}

export class ExpressServer implements HttpServer {
  private app: express.Application;
  private router: express.Router;

  constructor(app?: express.Application) {
    this.app = app ?? express();
    this.router = express.Router();
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.set("trust proxy", true);
    this.app.use("/api", this.router);
    this.app.use(expressErrorHandler);
  }

  get<T>(path: string, handler: HttpHandler<T>): void {
    this.router.get(path, handlerAdapter(handler));
  }

  post<T>(path: string, handler: HttpHandler<T>): void {
    this.router.post(path, handlerAdapter(handler));
  }

  put<T>(path: string, handler: HttpHandler<T>): void {
    this.router.put(path, handlerAdapter(handler));
  }

  patch<T>(path: string, handler: HttpHandler<T>): void {
    this.router.patch(path, handlerAdapter(handler));
  }

  delete<T>(path: string, handler: HttpHandler<T>): void {
    this.router.delete(path, handlerAdapter(handler));
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log("Here :) http://localhost:" + port);
    });
  }
}
