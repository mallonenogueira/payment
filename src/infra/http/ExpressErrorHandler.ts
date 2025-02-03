import { EntityMissingParams } from "@/domain/errors/EntityMissingParams";
import { EntityNotFound } from "@/domain/errors/EntityNotFound";
import { ValidationError } from "@/domain/errors/ValidationError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import express from "express";

export function expressErrorHandler(
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (error instanceof ValidationError) {
    return res.status(400).send({
      statusCode: 400,
      type: "ValidationError",
      message: error.message,
    });
  }

  if (error instanceof EntityNotFound) {
    return res.status(404).send({
      statusCode: 404,
      type: "EntityNotFound",
      message: error.message + error.entity,
      entity: error.entity,
    });
  }

  if (error instanceof EntityMissingParams) {
    return res.status(400).send({
      statusCode: 400,
      type: "EntityMissingParams",
      message: error.message,
      params: error.params,
    });
  }

  if (
    error instanceof SyntaxError &&
    "status" in error &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    return res.status((error.status as number) ?? 400).send({
      statusCode: (error.status as number) ?? 400,
      message: "Payload inválido.",
      type: "entity.parse.failed",
    });
  }

  if (error instanceof PrismaClientKnownRequestError) { 
    // https://www.prisma.io/docs/orm/reference/error-reference#error-codes
    console.error(error);

    return res.status(400).send({
      statusCode: 400,
      type: "ClientError",
      message: "Erro ao realizar operação.",
      modelName: error?.meta?.modelName,
      code: error.code,
    });
  }

  console.error(error);

  res.status(500).send({
    statusCode: 500,
    type: "InternalError",
    message: "Erro interno.",
  });
}
