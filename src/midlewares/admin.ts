import { NextFunction, Request, Response } from "express";
import { ExceptionError } from "../exceptions/exceptionError";
import { ErrorCode } from "../exceptions/root";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user!;
  if (user.role == "ADMIN") {
    next();
  } else {
    return next(
      new ExceptionError("Unauthorized!", 401, ErrorCode.UNAUTHORIZED, null)
    );
  }
};

export default adminMiddleware;
