import { NextFunction, type Request, type Response } from "express";
import prismaClient from "../prisma/prismaClient";
import bcrypt, { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SECRET_JWT } from "../secrets";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCode } from "../exceptions/root";
import { ExceptionError } from "../exceptions/exceptionError";
import { LoginSchema, SignUpSchema } from "../schemas/users";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = SignUpSchema.safeParse(req.body);
  if (!result.success)
    return next(
      new ExceptionError(
        "Invalid input data",
        422,
        ErrorCode.INVALID_INPUT_DATA,
        result.error.issues
      )
    );

  const { email, password, name } = result.data;
  const existingUser = await prismaClient.user.findFirst({
    where: { email },
  });

  if (existingUser)
    return next(
      new BadRequestException(
        "User already exists!",
        ErrorCode.USER_ALREADY_EXIST
      )
    );

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prismaClient.user.create({
    data: { name, email, password: hashedPassword },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
};




export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = LoginSchema.safeParse(req.body);

  if (!result.success)
    return next(
      new ExceptionError(
        "Invalid input data",
        422,
        ErrorCode.INVALID_INPUT_DATA,
        result.error.issues!
      )
    );
  const { email, password } = result.data;

  const existingUser = await prismaClient.user.findFirst({
    where: { email },
  });

  if (!existingUser)
    return next(
      new ExceptionError(
        "User does not exist!",
        401,
        ErrorCode.USER_NOT_FOUND,
        null
      )
    );

  const isMatch = await compare(password, existingUser?.password!);

  if (!isMatch)
    return next(
      new ExceptionError(
        "Incorrect username or password!",
        401,
        ErrorCode.INCORRECT_USERNAME_PASSWORD,
        null
      )
    );

  const token = jwt.sign({ userId: existingUser.id }, SECRET_JWT, {
    expiresIn: "30m",
  });
  const { password: _, ...userWithoutPassword } = existingUser;
  res.status(200).json({ user: userWithoutPassword, token });
};
