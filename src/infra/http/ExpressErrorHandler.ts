import { EntityMissingParams } from "@/domain/errors/EntityMissingParams";
import { EntityNotFound } from "@/domain/errors/EntityNotFound";
import { ValidationError } from "@/domain/errors/ValidationError";
import { UnauthorizedError } from "@/domain/errors/UnauthorizedError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import express from "express";
import { ForbiddenError } from "@/domain/errors/ForbiddenError";

export function expressErrorHandler(
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (
    error instanceof ValidationError ||
    ("type" in error && error.type === ValidationError.type)
  ) {
    return res.status(400).send({
      statusCode: 400,
      type: ValidationError.type,
      message: error.message,
    });
  }

  if (
    error instanceof UnauthorizedError ||
    ("type" in error && error.type === UnauthorizedError.type)
  ) {
    return res.status(401).send({
      statusCode: 401,
      type: UnauthorizedError.type,
      message: error.message,
    });
  }

  if (
    error instanceof ForbiddenError ||
    ("type" in error && error.type === ForbiddenError.type)
  ) {
    return res.status(403).send({
      statusCode: 403,
      type: ForbiddenError.type,
      message: error.message,
    });
  }

  if (
    error instanceof EntityNotFound ||
    ("type" in error && error.type === EntityNotFound.type)
  ) {
    return res.status(404).send({
      statusCode: 404,
      type: EntityNotFound.type,
      message: error.message,
      entity: error.entity,
    });
  }

  if (
    error instanceof EntityMissingParams ||
    ("type" in error && error.type === EntityMissingParams.type)
  ) {
    return res.status(400).send({
      statusCode: 400,
      type: EntityMissingParams.type,
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

  console.error(error);

  if (error instanceof PrismaClientKnownRequestError) {
    // https://www.prisma.io/docs/orm/reference/error-reference#error-codes
    return res.status(400).send({
      statusCode: 400,
      type: "PCKRQClientError",
      message: "Erro ao realizar operação.",
      modelName: error.meta?.modelName,
      target: error.meta?.target,
      code: error.code,
    });
  }

  res.status(500).send({
    statusCode: 500,
    type: "InternalError",
    message: "Erro interno.",
  });
}
