import { NextFunction, Request, Response } from "express";
import { HttpException } from "./../exceptions/root";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("**res", error.error);

  res.status(error.statusCode).json({
    message: error.message,
    statusCode: error.statusCode,
    errorCode: error.errorCode,
    error: error.error,
  });
};
