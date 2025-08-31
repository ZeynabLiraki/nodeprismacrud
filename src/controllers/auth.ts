import { NextFunction, type Request, type Response } from "express";
import prismaClient from "../prisma/prismaClient";
import bcrypt, { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SECRET_JWT } from "../secrets";
import { BadRequestException } from "../exceptions/badRequest";
import { ErrorCode } from "../exceptions/root";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prismaClient.user.findFirst({
      where: { email },
    });
    if (existingUser) {
       next(new BadRequestException(
        "User already exists!",
        ErrorCode.USER_ALREADY_EXIST
      ));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: { name, email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prismaClient.user.findFirst({
      where: { email },
    });
    if (!existingUser) {
      return res.status(401).json({ error: "User is not exist!" });
    }

    const isMatch = await compare(password, existingUser?.password!);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    const token = jwt.sign({ userId: existingUser.id }, SECRET_JWT, {
      expiresIn: "30m",
    });
    const { password: _, ...userWithoutPassword } = existingUser;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
