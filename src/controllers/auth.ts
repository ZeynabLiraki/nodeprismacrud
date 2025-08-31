import { type Request, type Response } from "express";
import prismaClient from "../prisma/prismaClient";
import bcrypt, { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { SECRET_JWT } from "../secrets";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prismaClient.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
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
