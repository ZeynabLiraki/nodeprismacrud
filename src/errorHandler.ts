import { Response, Request, NextFunction } from "express";
import { ErrorCode } from "./exceptions/root";
import { ExceptionError } from "./exceptions/exceptionError";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      next(
        new ExceptionError(
          "Internal server error",
          500,
          ErrorCode.INTERNAL_SERVER_ERROR,
          error?.issues
        )
      );
    }
  };
};
