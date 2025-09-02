import { NextFunction, Request, Response } from "express";
import { ExceptionError } from "../exceptions/exceptionError";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { SECRET_JWT } from "../secrets";
import prismaClient from "../prisma/prismaClient";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Extract the token from the header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return next(
      new ExceptionError("Unauthorized!", 401, ErrorCode.UNAUTHORIZED, null)
    );
  const token = authHeader.split(" ")[1];

  // 2. If token is not present throw an error of Unauthorized
  if (!token) {
    return next(
      new ExceptionError("Unauthorized!", 401, ErrorCode.UNAUTHORIZED, null)
    );
  }

  try {
    // 3. If token is present, verify that token and extract the payload
    const payload = jwt.verify(token!, SECRET_JWT) as any;
    // 4. Get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user)
      return next(
        new ExceptionError(
          "User not found!",
          404,
          ErrorCode.USER_NOT_FOUND,
          null
        )
      );
    // 5. Attach the user to the request object
    (req as any).user = user;
    next();
  } catch (error) {
    return next(
      new ExceptionError("User not found!", 404, ErrorCode.USER_NOT_FOUND, null)
    );
  }
};

export default authMiddleware;
