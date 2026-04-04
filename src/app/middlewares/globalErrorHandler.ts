

import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";


const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  console.error(err);

  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message: string = err.message || "Something went wrong!";
  let error: any = isDevelopment ? err : undefined;

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation error";
    error = err.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }));
  }
 
  const payload: Record<string, unknown> = {
    success,
    message,
  };

  if (error !== undefined) {
    payload.error = error;
  }

  return res.status(statusCode).json(payload);
};

export default globalErrorHandler;
